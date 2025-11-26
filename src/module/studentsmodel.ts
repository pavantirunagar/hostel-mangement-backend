import mongoose, { Schema, Document } from "mongoose";

export interface Student extends Document {
  name: string;
  email: string;
  phone: string;
  address: string;
  room: mongoose.Types.ObjectId;
}

const studentSchema = new Schema<Student>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    room: { type: Schema.Types.ObjectId, ref: "Room", required: true }
  },
  { timestamps: true }
);

export const Student = mongoose.model<Student>("Student", studentSchema);
