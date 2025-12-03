import { Request, Response } from "express";
import Room from "../../module/roommodel";

export const getRooms = async (req: Request, res: Response) => {
  try {
    const hostelId = req.user!.hostel;
    const { search, status } = req.query;

    const query: any = { hostel: hostelId };

    if (search) {
      const searchValue = search.toString();
      query.$or = [
        { roomNumber: { $regex: searchValue, $options: "i" } },
        { floor: isNaN(Number(searchValue)) ? undefined : Number(searchValue) }
      ].filter(Boolean);
    }

    if (status === "available") {
      query.isAvailable = true;
    }
    if (status === "full") {
      query.isAvailable = false;
    }

    const rooms = await Room.find(query).sort({ floor: 1 });

    return res.status(200).json({
      success: true,
      count: rooms.length,
      rooms,
    });
  } catch (error) {
    console.error("Get Rooms Error:", error);
    return res.status(500).json({ message: "Server Error", error });
  }
};
