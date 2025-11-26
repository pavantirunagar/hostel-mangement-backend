import { z } from "zod";

export const studentRegisterSchema = z.object({
  name: z.string().min(3, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  room: z.string().min(1, "Room ID is required"),
  address: z.string().min(3, "Address is required")
});
