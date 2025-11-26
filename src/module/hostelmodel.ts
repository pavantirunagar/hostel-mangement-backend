import mongoose, { Schema, Document } from "mongoose";

export interface Hostel extends Document {
  hostelName: string;
  owner: mongoose.Types.ObjectId;
  totalRooms: number;
}

const hostelSchema = new Schema<Hostel>(
  {
    hostelName: { type: String, required: true },
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    totalRooms: { type: Number, required: true },
  },
  { timestamps: true }
);

export const Hostel = mongoose.model<Hostel>("Hostel", hostelSchema);
