// src/controllers/rooms/updateRoom.controller.ts
import { Request, Response } from "express";
import Room from "../../module/roommodel";

export const updateRoom = async (req: Request, res: Response) => {
  try {
    const { pricePerBed, totalBeds } = req.body;
    const roomId = req.params.roomId;
    const hostelId = req.user!.hostel;

    // Fetch room
    const room = await Room.findOne({ _id: roomId, hostel: hostelId });

    if (!room) {
      return res.status(404).json({ success: false, message: "Room not found" });
    }

    // If totalBeds update requested → validate
    if (totalBeds !== undefined) {
      if (totalBeds < room.occupiedBeds) {
        return res.status(400).json({
          success: false,
          message: `Cannot set totalBeds less than occupiedBeds (${room.occupiedBeds})`,
        });
      }

      room.totalBeds = totalBeds;
      room.isAvailable = totalBeds > room.occupiedBeds;
    }

    // Update price if provided
    if (pricePerBed !== undefined) {
      room.pricePerBed = pricePerBed;
    }

    await room.save();

    return res.status(200).json({ success: true, room });
  } catch (error) {
    console.error("Update Room Error:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};
