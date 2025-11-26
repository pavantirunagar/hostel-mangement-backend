import { Request, Response } from "express";
import { User } from "../../module/usermodel";
import jwt from "jsonwebtoken";
import { Hostel } from "../../module/hostelmodel";
import { registerSchema } from "../../validations/registervalidations";

export const register = async (req: Request, res: Response) => {
  try {
    // Validate request data using Zod
    const validatedData = registerSchema.parse(req.body);

    const { name, email, password, hostelName, totalRooms } = validatedData;

    // Check if email exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Create User
    const newUser = await User.create({
      name,
      email,
      password,
    });

    // Create Hostel linked to user
    const newHostel = await Hostel.create({
      hostelName,
      owner: newUser._id,
      totalRooms,
    });

    newUser.hostel = newHostel._id;
    await newUser.save();

    // Generate JWT
    const token = jwt.sign(
      { id: newUser._id, hostel: newHostel._id },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    return res.status(201).json({
      success: true,
      message: "Owner + Hostel created Successfully",
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        hostel: newHostel._id,
      },
      hostel: newHostel,
      token,
    });

  } catch (error) {
    if (error instanceof Error && "issues" in error) {
      return res.status(400).json({
        message: "Validation failed",
        errors: error,
      });
    }

    return res.status(500).json({
      message: "Server error",
      error,
    });
  }
};
