// roommodel.ts

import mongoose, { Schema, Document, Types } from "mongoose";

export interface Room extends Document {
  floor: number;
  roomNumber: string;
  totalBeds: number;
  occupiedBeds: number;
  pricePerBed: number;
  hostel: Types.ObjectId;
  isAvailable: boolean;
}

const roomSchema = new Schema<Room>(
  {
    floor: { type: Number, required: true },
    roomNumber: { type: String, required: true },
    totalBeds: { type: Number, required: true },
    occupiedBeds: { type: Number, default: 0 },
    pricePerBed: { type: Number, required: true },
    hostel: { type: Schema.Types.ObjectId, ref: "Hostel", required: true },
    isAvailable: { type: Boolean, default: true }
  },
  { timestamps: true }
);

roomSchema.index({ hostel: 1, roomNumber: 1 }, { unique: true });

export default mongoose.model<Room>("Room", roomSchema);
