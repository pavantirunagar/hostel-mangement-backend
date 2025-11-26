import { Request, Response } from "express";
import Room from "../../module/roommodel";
import { Student } from "../../module/studentsmodel";

export const getDashboard = async (req: Request, res: Response) => {
  try {
    const hostelId = req.user!.hostel;

    // 1️⃣ Total Rooms
    const totalRooms = await Room.countDocuments({ hostel: hostelId });

    // 2️⃣ Total Students
    const totalStudents = await Student.countDocuments({ hostel: hostelId });

    // 3️⃣ Beds Calculation
    const rooms = await Room.find({ hostel: hostelId });

    let totalBeds = 0;
    let occupiedBeds = 0;

    rooms.forEach((room) => {
      totalBeds += room.totalBeds;
      occupiedBeds += room.totalBeds; // Later update based on assigned students
    });

    const availableBeds = totalBeds - occupiedBeds;

    return res.status(200).json({
      success: true,
      data: {
        totalRooms,
        totalStudents,
        totalBeds,
        occupiedBeds,
        availableBeds,
      },
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
};
