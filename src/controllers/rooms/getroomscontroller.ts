import { Request, Response } from "express";
import { Room } from "../../module/roommodel";
import { Student } from "../../module/studentsmodel";

export const getRooms = async (req: Request, res: Response) => {
  try {
    const rooms = await Room.find().lean();

    // Attach students count to each room
    const roomsWithStudents = await Promise.all(
      rooms.map(async (room: any) => {
        const studentCount = await Student.countDocuments({ room: room._id });
        return {
          ...room,
          studentCount,
        };
      })
    );

    res.status(200).json({
      success: true,
      rooms: roomsWithStudents,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error,
    });
  }
};
