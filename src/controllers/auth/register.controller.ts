import { Request, Response } from "express";
import { User } from "../../module/usermodel";
import  jwt  from "jsonwebtoken";


export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    // 1. Validate
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 2. Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 3. Create user
    const newUser = await User.create({
      name,
      email,
      password,
      role,
    });

    // 4. JWT token
    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
      token,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};
