import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";

export interface User extends Document {
  name: string;
  email: string;
  password: string;
  hostel: mongoose.Types.ObjectId;
}

export interface IUserMethods {
  comparePassword(password: string): Promise<boolean>;
}

const userSchema = new Schema<User & IUserMethods>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 6 },
    hostel: {
      type: Schema.Types.ObjectId,
      ref: "Hostel",
    },
  },
  { timestamps: true }
);

// Hash password before save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare Password Method
userSchema.methods.comparePassword = async function (
  enteredPassword: string
): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

export const User = mongoose.model<User & IUserMethods>("User", userSchema);
