import { Request, Response } from "express";
import { Student } from "../../module/studentsmodel";

export const listStudents = async (req: Request, res: Response) => {
  try {
    const { room, status, name, page = 1, limit = 10 } = req.query;

    const query: any = {};

    if (room) query.room = room;
    if (status) query.status = status;
    if (name)
      query.name = {
        $regex: name,
        $options: "i", // Case-insensitive
      };

    const skip = (Number(page) - 1) * Number(limit);

    const students = await Student.find(query)
      .populate("room")
      .skip(skip)
      .limit(Number(limit));

    const total = await Student.countDocuments(query);

    return res.status(200).json({
      success: true,
      count: students.length,
      total,
      currentPage: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      students,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};
