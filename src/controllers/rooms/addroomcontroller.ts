import { Request, Response } from "express";
import { Room } from "../../module/roommodel";

export const addRoom = async (req: Request, res: Response) => {
  try {
    const { roomNumber, capacity, floor } = req.body;

    // Validation
    if (!roomNumber || !capacity || floor === undefined) {
      return res.status(400).json({ message: "roomNumber, capacity, and floor are required" });
    }

    // Check existing room
    const existingRoom = await Room.findOne({ roomNumber });
    if (existingRoom) {
      return res.status(400).json({ message: "Room already exists" });
    }

    const room = await Room.create({
      roomNumber,
      capacity,
      floor,
      occupied: 0,
      isAvailable: true,
    });

    res.status(201).json({
      message: "Room added successfully",
      room,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error,
    });
  }
};
