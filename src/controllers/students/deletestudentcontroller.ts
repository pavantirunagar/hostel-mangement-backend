import { Request, Response } from "express";
import { Student } from "../../module/studentsmodel";
import Room from "../../module/roommodel";

export const deleteStudent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const student = await Student.findById(id);
    if (!student) return res.status(404).json({ message: "Student not found" });

    const roomId = student.room?.toString() || null;

    student.status = "vacated";
    student.room = null as any;
    await student.save();

    if (roomId) {
      const room = await Room.findById(roomId);
      if (room) {
        room.occupiedBeds = Math.max(0, room.occupiedBeds - 1);
        room.isAvailable = room.occupiedBeds < room.totalBeds;
        await room.save();
      }
    }

    return res.status(200).json({
      success: true,
      message: "Student marked as vacated",
    });
  } catch (error) {
    console.error("Vacate Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

