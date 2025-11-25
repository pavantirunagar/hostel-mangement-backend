import { Request, Response } from "express";
import { Student } from "../../module/studentsmodel";
import { Room } from "../../module/roommodel";

export const getDashboard = async (req: Request, res: Response) => {
  try {
    // Student stats
    const totalStudents = await Student.countDocuments();
    const activeStudents = await Student.countDocuments({ status: "active" });
    const leftStudents = await Student.countDocuments({ status: "left" });

    // Room stats
    const totalRooms = await Room.countDocuments();

    const fullRooms = await Room.countDocuments({
      $expr: { $eq: ["$occupied", "$capacity"] }
    });

    const availableRooms = await Room.countDocuments({
      $expr: { $lt: ["$occupied", "$capacity"] }
    });

    // Capacity stats (aggregation)
    const stats = await Room.aggregate([
      {
        $group: {
          _id: null,
          totalCapacity: { $sum: "$capacity" },
          totalOccupiedSeats: { $sum: "$occupied" },
        },
      },
    ]);

    const totalCapacity = stats[0]?.totalCapacity || 0;
    const totalOccupiedSeats = stats[0]?.totalOccupiedSeats || 0;
    const totalFreeSeats = totalCapacity - totalOccupiedSeats;

    res.json({
      success: true,
      data: {
        totalStudents,
        activeStudents,
        leftStudents,
        totalRooms,
        occupiedRooms: fullRooms,
        availableRooms,
        totalCapacity,
        totalOccupiedSeats,
        totalFreeSeats,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
