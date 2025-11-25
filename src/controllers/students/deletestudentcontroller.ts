import { Request, Response } from "express";
import { Student } from "../../module/studentsmodel";
import { Room } from "../../module/roommodel"; 

export const deleteStudent = async (req: Request, res: Response) => {
  try {
    const studentId = req.params.id;

    // 1. Find the student
    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // 2. If student has a room, decrease occupancy
    if (student.room) {
      const room = await Room.findById(student.room);

      if (room) {
        // decrease occupancy but never below 0
        room.occupied = Math.max(0, room.occupied - 1);

        // update availability
        room.isAvailable = room.occupied < room.capacity;

        await room.save();
      }
    }

    // 3. Delete the student
    await Student.findByIdAndDelete(studentId);

    res.json({ message: "Student deleted successfully" });

  } catch (error) {
    console.error("Delete Student Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
