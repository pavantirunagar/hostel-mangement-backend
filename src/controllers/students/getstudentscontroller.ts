import { Request, Response } from "express";
import { Student } from "../../module/studentsmodel";
import Room from "../../module/roommodel";

export const getStudents = async (req: Request, res: Response) => {
  try {
    const hostelId = req.user!.hostel;

    const students = await Student.find()
      .populate({
        path: "room",
        match: { hostel: hostelId },  // Ensures only current owner’s hostel
        select: "roomNumber floor",
      })
      .sort({ createdAt: -1 });

    // Filter out students from other hostels (populate match returns null)
    const filteredStudents = students.filter((std) => std.room !== null);

    res.status(200).json({
      success: true,
      count: filteredStudents.length,
      students: filteredStudents,
    });

  } catch (error) {
    console.error("Get Students Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
