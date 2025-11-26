import { Request, Response } from "express";
import Room from "../../module/roommodel";

export const addRoom = async (req: Request, res: Response) => {
  try {
    const { floor, roomNumber, totalBeds, pricePerBed } = req.body;
    const hostelId = req.user!.hostel;

    // Validation
    if (!floor || !roomNumber || !totalBeds || !pricePerBed) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (totalBeds <= 0) {
      return res.status(400).json({ message: "totalBeds must be at least 1" });
    }

    if (!Number.isInteger(pricePerBed) || pricePerBed <= 0) {
      return res.status(400).json({ message: "pricePerBed must be a positive integer" });
    }

    // Check if room already exists in this hostel
    const existingRoom = await Room.findOne({ roomNumber, hostel: hostelId });
    if (existingRoom) {
      return res.status(400).json({ message: "Room already exists in this hostel" });
    }

    const newRoom = await Room.create({
      floor,
      roomNumber,
      totalBeds,
      pricePerBed,
      hostel: hostelId,
    });

    res.status(201).json({ success: true, room: newRoom });
  } catch (error) {
    console.error("Add Room Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
