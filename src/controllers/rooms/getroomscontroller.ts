import { Request, Response } from "express";
import Room from "../../module/roommodel";
import { Student } from "../../module/studentsmodel";

export const getRooms = async (req: Request, res: Response) => {
  try {
    const hostelId = req.user!.hostel;

    const rooms = await Room.find({ hostel: hostelId }).sort({ roomNumber: 1 });

    const roomsWithOccupancy = await Promise.all(
      rooms.map(async (room) => {
        const occupiedCount = await Student.countDocuments({ room: room._id });

        return {
          ...room.toObject(),
          occupiedBeds: occupiedCount,
          isAvailable: occupiedCount < room.totalBeds,
        };
      })
    );

    res.status(200).json({
      success: true,
      count: roomsWithOccupancy.length,
      rooms: roomsWithOccupancy,
    });

  } catch (error) {
    console.error("Get Rooms Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
