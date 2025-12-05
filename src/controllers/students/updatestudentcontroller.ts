// src/controllers/students/updateStudentController.ts
import { Request, Response } from "express";
import { Student } from "../../module/studentsmodel";
import Room from "../../module/roommodel";

export const updateStudent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, phone, address, room } = req.body;

    const hostelId = req.user!.hostel;

    const student = await Student.findById(id).populate("room");
    if (!student) return res.status(404).json({ message: "Student not found" });

    // Validate owner access
    if (student.room) {
  const room = student.room as any; // Force as populated Room

  if (room.hostel?.toString() !== hostelId.toString()) {
    return res.status(403).json({ message: "Access denied" });
  }
}


    // If room changed
    if (room && student.room?._id.toString() !== room) {
      const newRoom = await Room.findOne({ _id: room, hostel: hostelId });
      if (!newRoom) return res.status(404).json({ message: "New room not found" });

      if (newRoom.occupiedBeds >= newRoom.totalBeds) {
        return res.status(400).json({ message: "Room is full" });
      }

      // Update old room
      const oldRoom = await Room.findById(student.room);
      if (oldRoom) {
        oldRoom.occupiedBeds -= 1;
        oldRoom.isAvailable = oldRoom.occupiedBeds < oldRoom.totalBeds;
        await oldRoom.save();
      }

      // Update new room
      newRoom.occupiedBeds += 1;
      newRoom.isAvailable = newRoom.occupiedBeds < newRoom.totalBeds;
      await newRoom.save();

      student.room = newRoom._id;
    }

    student.name = name;
    student.phone = phone;
    student.address = address;
    await student.save();

    res.status(200).json({ success: true, message: "Student updated successfully", student });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

