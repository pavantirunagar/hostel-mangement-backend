import { Request, Response } from "express";
import { Room } from "../../module/roommodel";

export const addRoom = async (req: Request, res: Response) => {
  try {
    const { roomNumber, capacity } = req.body;

    // 1. Validate input
    if (!roomNumber || !capacity) {
      return res.status(400).json({ message: "roomNumber and capacity are required" });
    }

    // 2. Check if room already exists
    const existingRoom = await Room.findOne({ roomNumber });
    if (existingRoom) {
      return res.status(400).json({ message: "Room already exists" });
    }

    // 3. Create room
    const room = await Room.create({ roomNumber, capacity });

    return res.status(201).json({
      message: "Room created successfully",
      room,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};
