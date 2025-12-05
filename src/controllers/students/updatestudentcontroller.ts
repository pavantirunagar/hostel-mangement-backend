// src/controllers/students/updateStudentController.ts
import { Request, Response } from "express";
import { Student } from "../../module/studentsmodel";
import Room from "../../module/roommodel";

export const updateStudent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, phone, address, room } = req.body;

    const student = await Student.findById(id);
    if (!student) return res.status(404).json({ message: "Student not found" });

    // If room changed → adjust previous and new room beds
    if (room && room !== student.room?.toString()) {
      const prevRoom = await Room.findById(student.room);
      if (prevRoom) {
        prevRoom.occupiedBeds = Math.max(0, prevRoom.occupiedBeds - 1);
        prevRoom.isAvailable = prevRoom.occupiedBeds < prevRoom.totalBeds;
        await prevRoom.save();
      }

      const newRoom = await Room.findById(room);
      if (!newRoom) return res.status(404).json({ message: "New Room not found" });
      if (newRoom.occupiedBeds >= newRoom.totalBeds)
        return res.status(400).json({ message: "New room full" });

      newRoom.occupiedBeds += 1;
      newRoom.isAvailable = newRoom.occupiedBeds < newRoom.totalBeds;
      await newRoom.save();
    }

    student.name = name || student.name;
    student.phone = phone || student.phone;
    student.address = address || student.address;
    student.room = room || student.room;

    await student.save();

    res.status(200).json({
      success: true,
      message: "Student updated successfully",
      student,
    });
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

