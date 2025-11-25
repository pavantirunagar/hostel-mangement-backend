import { Request, Response } from "express";
import { Room } from "../../module/roommodel";

export const getRooms = async (req: Request, res: Response) => {
  try {
    let query: any = {};

    // ---------------------------------------------------
    // 1. FILTERS
    // ---------------------------------------------------

    // Filter by availability (available / full)
    if (req.query.status) {
      if (req.query.status === "available") {
        query.isAvailable = true;
      } else if (req.query.status === "full") {
        query.isAvailable = false;
      }
    }

    // Filter by room number
    if (req.query.roomNumber) {
      query.roomNumber = Number(req.query.roomNumber);
    }

    // Filter by floor (if your model contains floor)
    if (req.query.floor) {
      query.floor = Number(req.query.floor);
    }

    // Searching rooms
    if (req.query.search) {
      const regex = new RegExp(req.query.search as string, "i");
      query.$or = [
        { roomName: regex },
        { roomType: regex },
      ];
    }

    // ---------------------------------------------------
    // 2. PAGINATION
    // ---------------------------------------------------
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // ---------------------------------------------------
    // 3. SORTING
    // ---------------------------------------------------
    let sortQuery = {};

    switch (req.query.sort) {
      case "room_asc":
        sortQuery = { roomNumber: 1 };
        break;
      case "room_desc":
        sortQuery = { roomNumber: -1 };
        break;
      case "occupied_asc":
        sortQuery = { occupied: 1 };
        break;
      case "occupied_desc":
        sortQuery = { occupied: -1 };
        break;
      case "floor_asc":
        sortQuery = { floor: 1 };
        break;
      case "floor_desc":
        sortQuery = { floor: -1 };
        break;
      default:
        sortQuery = { roomNumber: 1 };
    }

    // ---------------------------------------------------
    // 4. DATABASE QUERY
    // ---------------------------------------------------
    const rooms = await Room.find(query)
      .populate("students")        // if your Room model stores student references
      .sort(sortQuery)
      .skip(skip)
      .limit(limit);

    const totalRooms = await Room.countDocuments(query);

    // ---------------------------------------------------
    // 5. RESPONSE
    // ---------------------------------------------------
    res.json({
      success: true,
      totalRooms,
      page,
      totalPages: Math.ceil(totalRooms / limit),
      count: rooms.length,
      rooms,
    });

  } catch (error) {
    console.error("Room List Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
      error,
    });
  }
};
