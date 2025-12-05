import { Request, Response } from "express";
import Room from "../../module/roommodel";

export const addRoom = async (req: Request, res: Response) => {
  try {
    const { floor, roomNumber, totalBeds, pricePerBed } = req.body;
    const hostelId = req.user!.hostel;

    const floorNum = Number(floor);
    const bedsNum = Number(totalBeds);
    const priceNum = Number(pricePerBed);

    // Validation
    if (!floorNum || !roomNumber || !bedsNum || !priceNum) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (bedsNum <= 0) {
      return res.status(400).json({ message: "totalBeds must be at least 1" });
    }

    if (priceNum <= 0) {
      return res.status(400).json({ message: "pricePerBed must be a positive number" });
    }

    const newRoom = await Room.create({
      floor: floorNum,
      roomNumber,
      totalBeds: bedsNum,
      pricePerBed: priceNum,
      hostel: hostelId,
    });

    return res.status(201).json({
      success: true,
      message: "Room added successfully",
      room: newRoom,
    });

  } catch (error: any) {
    console.error("Add Room Error:", error);

    // MongoDB duplicate handling (room exists in same hostel)
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Room number already exists in this hostel"
      });
    }

    res.status(500).json({ message: "Server Error" });
  }
};
