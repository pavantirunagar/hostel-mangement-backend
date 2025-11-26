import mongoose, { Schema, Document } from "mongoose";

export interface Room extends Document {
  floor: number;
  roomNumber: string;
  pricePerBed: number;
  totalBeds: number;
  occupiedBeds: number;
  isAvailable: boolean;
  hostel: mongoose.Schema.Types.ObjectId;
}

const roomSchema = new Schema<Room>(
  {
    floor: { type: Number, required: true },
    roomNumber: { type: String, required: true },
    pricePerBed: { type: Number, required: true },
    totalBeds: { type: Number, required: true },

    // 👇 Required for student assignment + room availability
    occupiedBeds: { type: Number, required: true, default: 0 },
    isAvailable: { type: Boolean, required: true, default: true },

    hostel: { type: Schema.Types.ObjectId, ref: "Hostel", required: true },
  },
  { timestamps: true }
);

// Unique index per hostel
roomSchema.index({ roomNumber: 1, hostel: 1 }, { unique: true });

export default mongoose.model<Room>("Room", roomSchema);
