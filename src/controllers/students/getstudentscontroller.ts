import { Request, Response } from "express";
import { Student } from "../../module/studentsmodel";
import {Room }from "../../module/roommodel";

export const getStudents = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const hostelId = req.user!.hostel;

    const student = await Student.findById(id).populate("room");
    if (!student) return res.status(404).json({ message: "Student not found" });

    // Type-safe host validation
    if (student.room) {
      const room = student.room as unknown as Room;

      if (room.hostel?.toString() !== hostelId.toString()) {
        return res.status(403).json({ message: "Access denied" });
      }
    }

    res.status(200).json({ success: true, student });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
