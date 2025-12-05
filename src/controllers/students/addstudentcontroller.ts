import { Request, Response } from "express";
import { Student } from "../../module/studentsmodel";
import Room from "../../module/roommodel";

export const addStudent = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, room, address, joinDate } = req.body;
    const hostelId = req.user!.hostel;

    if (!name || !email || !phone || !address || !room || !joinDate) {
      return res.status(400).json({ message: "All fields including joinDate are required" });
    }

    const joinDateObj = new Date(joinDate);
    if (isNaN(joinDateObj.getTime())) {
      return res.status(400).json({ message: "Invalid joinDate format" });
    }

    const dueDate = new Date(joinDateObj);
    dueDate.setDate(joinDateObj.getDate() + 30);

    const selectedRoom = await Room.findOne({ _id: room, hostel: hostelId });
    if (!selectedRoom) return res.status(404).json({ message: "Room not found in your hostel" });

    if (selectedRoom.occupiedBeds >= selectedRoom.totalBeds) {
      return res.status(400).json({ message: "No beds available in this room" });
    }

    const exists = await Student.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already exists" });

    const newStudent = await Student.create({
      name,
      email,
      phone,
      address,
      room,
      joinDate: joinDateObj,
      dueDate,
      status: "active",
    });

    selectedRoom.occupiedBeds += 1;
    selectedRoom.isAvailable = selectedRoom.occupiedBeds < selectedRoom.totalBeds;
    await selectedRoom.save();

    res.status(201).json({
      success: true,
      message: "Student added successfully",
      student: newStudent,
    });

  } catch (error) {
    console.error("ADD STUDENT ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};


