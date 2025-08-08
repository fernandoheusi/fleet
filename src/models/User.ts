import { model, Schema } from "mongoose";

interface IUser {
  id: string;
  name: string;
  email: string;
  password: string;
}

const userSchema = new Schema<IUser>(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

export const User = model<IUser>("User", userSchema);
