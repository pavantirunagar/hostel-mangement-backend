import { Request, Response } from "express";
import { Student } from "../../module/studentsmodel";

export const listStudents = async (req: Request, res: Response) => {
  try {
    const hostelId = req.user!.hostel; // Logged in owner hostel
    const { search, status = "all", page = 1, limit = 10 } = req.query;

    let query: any = { hostel: hostelId };

    if (status !== "all") {
      query.status = status;
    }

    const skip = (Number(page) - 1) * Number(limit);

    let students = await Student.find(query)
      .populate({
        path: "room",
        match: { hostel: hostelId }, // ensure room belongs to owner
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    // Search (name, email, phone, roomNumber)
    if (search) {
      const s = search.toString().toLowerCase();
      students = students.filter((st: any) =>
        st.name.toLowerCase().includes(s) ||
        st.email.toLowerCase().includes(s) ||
        st.phone.includes(s) ||
        st.room?.roomNumber?.toString().includes(s)
      );
    }

    const total = await Student.countDocuments(query);

    res.status(200).json({
      success: true,
      count: students.length,
      total,
      currentPage: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      students,
    });

  } catch (error) {
    console.error("List Students Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
