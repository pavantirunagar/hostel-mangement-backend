import { z } from "zod";

export const studentRegisterSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(10, "Phone number required"),
  address: z.string().min(1, "Address is required"),
  room: z.string().min(1, "Room is required"),
  joinDate: z.string().min(1, "Join Date is required"),
});
