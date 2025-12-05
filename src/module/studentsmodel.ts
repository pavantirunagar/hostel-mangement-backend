import mongoose, { Schema, Document, Types } from "mongoose";
import { Room } from "./roommodel";

export interface Student extends Document {
  name: string;
  email: string;
  phone: string;
  address: string;
  hostel: Types.ObjectId; // Added
  room: Types.ObjectId | Room | null;
  status: "active" | "vacated";
  joinDate: Date;
  dueDate: Date;
}

const studentSchema = new Schema<Student>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },

    hostel: { type: Schema.Types.ObjectId, ref: "Hostel", required: true }, // 🔥 Added field

    room: { type: Schema.Types.ObjectId, ref: "Room", default: null },

    status: { type: String, enum: ["active", "vacated"], default: "active" },

    joinDate: { type: Date, required: true },
    dueDate: { type: Date },
  },
  { timestamps: true }
);

export const Student = mongoose.model<Student>("Student", studentSchema);
