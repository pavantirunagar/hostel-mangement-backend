// src/controllers/rooms/getSingleRoom.controller.ts
import { Request, Response } from "express";
import Room from "../../module/roommodel";
import { Student } from "../../module/studentsmodel";

export const getSingleRoom = async (req: Request, res: Response) => {
  try {
    const roomId = req.params.id;
    const hostelId = req.user!.hostel;

    // Check room belongs to this owner's hostel
    const room = await Room.findOne({ _id: roomId, hostel: hostelId });

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    // Fetch students in this room
    const students = await Student.find({ room: roomId }).select(
      "name email phone status"
    );

    return res.status(200).json({
      success: true,
      room,
      students,
      totalStudents: students.length,
      availableBeds: room.totalBeds - students.length,
    });
  } catch (error) {
    console.error("Get Single Room Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
