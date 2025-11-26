import { Request, Response } from "express";
import { Student } from "../../module/studentsmodel";

export const getSingleStudent = async (req: Request, res: Response) => {
  try {
    const studentId = req.params.id;

    const student = await Student.findById(studentId).populate("room");

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    return res.status(200).json({
      success: true,
      student,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};
