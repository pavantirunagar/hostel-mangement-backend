import { Request,Response } from "express";
import { Student } from "../../module/studentsmodel";

export const listStudents  = async(req:Request, res:Response) =>{
    try{
    const { room, status, name } = req.query;

    const query: any = {};

    if (room) query.room = room;
    if (status) query.status = status;
if (name) query.name = { $regex: name, $options: "i" };
const students = await Student.find(query).populate("room");
 return res.status(200).json({
      success: true,
      count: students.length,
      students,
    });
    }
    catch(error){
    return res.status(500).json({ message: "Server error", error });
    }
}