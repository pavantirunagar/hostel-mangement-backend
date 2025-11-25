import mongoose, { Schema, Document } from "mongoose";

export interface Student extends Document {
  name: string;
  email: string;
  phone: string;
  room: mongoose.Types.ObjectId;
  joiningDate: Date;
  leavingDate?: Date;
  status: "active" | "left";
}

const studentSchema = new Schema<Student>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },

    room: {
      type: Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },

    joiningDate: { type: Date, default: Date.now },

    leavingDate: { type: Date },

    status: {
      type: String,
      enum: ["active", "left"],
      default: "active",
    },
  },
  { timestamps: true }
);

export const Student = mongoose.model<Student>("Student", studentSchema);
