import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Invalid email format"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[!@#$%^&*(),.?":{}|<>]/, "Password must include a special character")
    .regex(/[0-9]/, "Password must include a number"),
  role: z.enum(["admin", "warden"]).default("admin"),
});
