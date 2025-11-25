import mongoose, { Schema, Document } from "mongoose";

export interface Room extends Document {
  roomNumber: string;
  floor: number;      
  capacity: number;
  occupied: number;
  isAvailable: boolean;
}

const roomSchema = new Schema<Room>(
  {
    roomNumber: { type: String, required: true, unique: true },
    floor: { type: Number, required: true }, 
    capacity: { type: Number, required: true },
    occupied: { type: Number, default: 0 },
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

roomSchema.pre("save", function (next) {
  this.isAvailable = this.occupied < this.capacity;
  next();
});

export const Room = mongoose.model<Room>("Room", roomSchema);
