import { Request, Response } from "express";
import { Student } from "../../module/studentsmodel";
import { Room } from "../../module/roommodel";

export const updateStudent = async (req: Request, res: Response) => {
  try {
    const studentId = req.params.id;
    const { name, email, phone, status, room: newRoomId } = req.body;

    // 1. Find existing student
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // 2. Check if room is being changed
    const oldRoomId = student.room;

    if (newRoomId && newRoomId !== oldRoomId.toString()) {
      const oldRoom = await Room.findById(oldRoomId);
      const newRoom = await Room.findById(newRoomId);

      if (!oldRoom) {
        return res.status(404).json({ message: "Old room not found" });
      }

      if (!newRoom) {
        return res.status(404).json({ message: "New room not found" });
      }

      // Check if new room has space
      if (newRoom.occupied >= newRoom.capacity) {
        return res.status(400).json({ message: "New room is full" });
      }

      // 👉 Decrease occupancy in old room
      oldRoom.occupied -= 1;
      oldRoom.isAvailable = oldRoom.occupied < oldRoom.capacity;
      await oldRoom.save();

      // 👉 Increase occupancy in new room
      newRoom.occupied += 1;
      newRoom.isAvailable = newRoom.occupied < newRoom.capacity;
      await newRoom.save();

      student.room = newRoomId;
    }

    // Update other fields
    if (name) student.name = name;
    if (email) student.email = email;
    if (phone) student.phone = phone;
    if (status) student.status = status;

    await student.save();

    res.json({
      message: "Student updated successfully",
      student,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
