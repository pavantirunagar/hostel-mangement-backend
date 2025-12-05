import { Request, Response } from "express";
import { Student } from "../../module/studentsmodel";

export const listStudents = async (req: Request, res: Response) => {
  try {
    const { search = "", status = "all", page = 1, limit = 10 } = req.query;

    const query: any = {};

    if (status !== "all" && typeof status === "string") {
      query.status = status.toLowerCase(); 
    }

    const skip = (Number(page) - 1) * Number(limit);

    let students = await Student.find(query)
      .populate("room")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

  if (search) {
  const s = search.toString().toLowerCase();

  students = students.filter((st: any) => {
    const nameMatch = st.name.toLowerCase().includes(s);
    const emailMatch = st.email.toLowerCase().includes(s);
    const phoneMatch = st.phone.includes(s);

    const roomMatch =
      st.room &&
      typeof (st.room as any).roomNumber !== "undefined" &&
      (st.room as any).roomNumber.toString().toLowerCase().includes(s);

    return nameMatch || emailMatch || phoneMatch || roomMatch;
  });
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



