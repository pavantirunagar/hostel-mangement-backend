// src/controllers/students/updateStudentController.ts
import { Request, Response } from "express";
import { Student } from "../../module/studentsmodel";
import Room from "../../module/roommodel";

export const updateStudent = async (req: Request, res: Response) => {
  try {
    const studentId = req.params.id;
    const { name, email, phone, address } = req.body;
    const hostelId = req.user!.hostel;

    // 1️⃣ Check if student exists & belongs to same hostel rooms
    const student = await Student.findById(studentId).populate("room");
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const roomCheck = await Room.findOne({ _id: student.room, hostel: hostelId });
    if (!roomCheck) {
      return res.status(403).json({
        message: "You are not authorized to update this student"
      });
    }

    // 2️⃣ Update fields if present
    if (name) student.name = name;
    if (email) student.email = email;
    if (phone) student.phone = phone;
    if (address) student.address = address;

    await student.save();

    return res.status(200).json({
      success: true,
      message: "Student updated successfully",
      student,
    });

  } catch (error) {
    console.error("Update Student Error:", error);
    return res.status(500).json({
      message: "Server error",
      error: (error as Error).message,
    });
  }
};
