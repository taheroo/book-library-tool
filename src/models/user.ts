import mongoose from "mongoose";

export interface User {
  email: string;
  points: number;
}

const userSchema = new mongoose.Schema<User>({
  email: { type: String, required: true },
  points: { type: Number, default: 0 },
});

userSchema.index({ email: 1 }, { unique: true });

const UserModel = mongoose.model<User>("User", userSchema);

export default UserModel;
