import { Request, Response } from "express";
import { Student } from "../../module/studentsmodel";
import Room from "../../module/roommodel";

export const addStudent = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, room, address } = req.body;
    const hostelId = req.user!.hostel;

    // Required field check
    if (!name || !email || !phone || !room || !address) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validate room belongs to owner
    const selectedRoom = await Room.findOne({ _id: room, hostel: hostelId });
    if (!selectedRoom) {
      return res.status(404).json({ message: "Room not found in your hostel" });
    }

    // Check student email exists?
    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Check room availability
    if (selectedRoom.occupiedBeds >= selectedRoom.totalBeds) {
      return res.status(400).json({
        message: "No beds available in this room",
      });
    }

    // Create student
    const newStudent = await Student.create({
      name,
      email,
      phone,
      room,
      address,
      status: "active",
    });

    // Update room occupancy
    selectedRoom.occupiedBeds += 1;
    selectedRoom.isAvailable =
      selectedRoom.occupiedBeds < selectedRoom.totalBeds;
    await selectedRoom.save();

    return res.status(201).json({
      success: true,
      message: "Student added successfully",
      student: newStudent,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error });
  }
};
