import { Request, Response } from "express";
import Room from "../../module/roommodel";
import { Student } from "../../module/studentsmodel";

export const getDashboard = async (req: Request, res: Response) => {
  try {
    const hostelId = req.user!.hostel;

    const totalRooms = await Room.countDocuments({ hostel: hostelId });

    const rooms = await Room.find({ hostel: hostelId });

    const totalBeds = rooms.reduce((sum, r) => sum + r.totalBeds, 0);
    const occupiedBeds = rooms.reduce((sum, r) => sum + r.occupiedBeds, 0);
    const availableBeds = totalBeds - occupiedBeds;

    const fullRooms = rooms.filter(r => r.occupiedBeds >= r.totalBeds).length;
    const availableRooms = rooms.filter(r => r.occupiedBeds < r.totalBeds).length;

    const totalStudents = await Student.countDocuments({ hostel: hostelId });

    const activeStudents = await Student.countDocuments({
      hostel: hostelId,
      status: "active"
    });

    const vacatedStudents = await Student.countDocuments({
      hostel: hostelId,
      status: "vacated"
    });

    return res.status(200).json({
      success: true,
      data: {
        totalRooms,
        availableRooms,
        fullRooms,
        totalBeds,
        occupiedBeds,
        availableBeds,
        totalStudents,
        activeStudents,
        vacatedStudents,
      },
    });
  } catch (error) {
    console.error("Dashboard Error:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};
