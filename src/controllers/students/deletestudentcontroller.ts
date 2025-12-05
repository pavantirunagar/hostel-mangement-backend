import { Request, Response } from "express";
import { Student } from "../../module/studentsmodel";
import Room from "../../module/roommodel";

export const deleteStudent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const hostelId = req.user!.hostel;

    const student = await Student.findById(id).populate("room");
    if (!student) return res.status(404).json({ message: "Student not found" });

    // Owner can't delete other hostel's student
   if (student.room) {
  const room = student.room as any; // populated room

  if (room.hostel?.toString() !== hostelId.toString()) {
    return res.status(403).json({ message: "Access denied" });
  }
}


    const room = await Room.findById(student.room);
    if (room) {
      room.occupiedBeds = Math.max(0, room.occupiedBeds - 1);
      room.isAvailable = room.occupiedBeds < room.totalBeds;
      await room.save();
    }

    student.status = "vacated";
    student.room = null;
    await student.save();

    res.status(200).json({ success: true, message: "Student vacated successfully" });

  } catch (error) {
    console.error("Vacate Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};


