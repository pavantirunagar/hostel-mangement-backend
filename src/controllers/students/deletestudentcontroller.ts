import { Request, Response } from "express";
import { Student } from "../../module/studentsmodel";
import Room from "../../module/roommodel";

export const deleteStudent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const student = await Student.findById(id);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const roomId = student.room?.toString();

    // Delete student record
    await student.deleteOne();

    // Update the room’s occupancy if room assigned
    if (roomId) {
      const roomStudentsCount = await Student.countDocuments({ room: roomId });
      await Room.findByIdAndUpdate(roomId, {
        isAvailable: true,
      });

      // If room is fully empty -> available
      if (roomStudentsCount === 0) {
        await Room.findByIdAndUpdate(roomId, { isAvailable: true });
      }
    }

    return res.status(200).json({
      success: true,
      message: "Student removed successfully",
    });

  } catch (error) {
    console.error("Delete Student Error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};
