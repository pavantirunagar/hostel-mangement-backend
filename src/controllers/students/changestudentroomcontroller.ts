// src/controllers/students/changeRoomController.ts
import { Request, Response } from "express";
import { Student } from "../../module/studentsmodel";
import Room from "../../module/roommodel";

export const changeStudentRoom = async (req: Request, res: Response) => {
  try {
    const studentId = req.params.id;
    const { newRoom } = req.body;
    const hostelId = req.user!.hostel;

    if (!newRoom) {
      return res.status(400).json({ message: "New room is required" });
    }

    // 1️⃣ Check Student Exists
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // 2️⃣ Ensure student is from logged owner's hostel rooms
    const oldRoom = await Room.findOne({ _id: student.room, hostel: hostelId });
    if (!oldRoom) {
      return res.status(403).json({ message: "Student doesn't belong to your hostel" });
    }

    // 3️⃣ Check new room belongs to same hostel
    const newRoomData = await Room.findOne({ _id: newRoom, hostel: hostelId });
    if (!newRoomData) {
      return res.status(404).json({ message: "New room not found in your hostel" });
    }

    // 4️⃣ Check New Room Availability
    if (newRoomData.occupiedBeds >= newRoomData.totalBeds) {
      return res.status(400).json({ message: "New room has no available beds" });
    }

    // 5️⃣ Update Occupancy Counts
    oldRoom.occupiedBeds -= 1;
    oldRoom.isAvailable = oldRoom.occupiedBeds < oldRoom.totalBeds;
    await oldRoom.save();

    newRoomData.occupiedBeds += 1;
    newRoomData.isAvailable = newRoomData.occupiedBeds < newRoomData.totalBeds;
    await newRoomData.save();

    // 6️⃣ Update Student Room Reference
    student.room = newRoom;
    await student.save();

    return res.status(200).json({
      success: true,
      message: "Student room updated successfully",
      student,
    });

  } catch (error) {
    console.error("Room Change Error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};
