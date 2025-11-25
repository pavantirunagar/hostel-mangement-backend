import { Request, Response } from "express";
import { Student } from "../../module/studentsmodel";
import { Room } from "../../module/roommodel";

export const addStudent = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, room } = req.body;

    // 1️⃣ Check if room exists
    const selectedRoom = await Room.findById(room);
    if (!selectedRoom) {
      return res.status(404).json({ message: "Room not found" });
    }

    // 2️⃣ Check room availability
    if (selectedRoom.occupied >= selectedRoom.capacity) {
      return res.status(400).json({ message: "No beds available in this room" });
    }

    // 3️⃣ Create student
    const newStudent = await Student.create({
      name,
      email,
      phone,
      room,
    });

    // 4️⃣ Update room occupancy
    selectedRoom.occupied += 1;
    // If using isAvailable field
    selectedRoom.isAvailable = selectedRoom.occupied < selectedRoom.capacity;
    await selectedRoom.save();

    // 5️⃣ Return response
    return res.status(201).json({
      message: "Student added and assigned to room",
      student: newStudent,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error", error });
  }
};
