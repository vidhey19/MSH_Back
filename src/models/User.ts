import mongoose, { Schema, Document } from "mongoose";

// Define the user interface
export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  age: number;
  gender: "male" | "female" | "other";
  refreshToken: String;
}

// Define Mongoose schema
const UserSchema: Schema = new Schema<IUser>(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      match: [/^[A-Za-z]+$/, "First name must contain only letters"],
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
      match: [/^[A-Za-z]+$/, "Last name must contain only letters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, "Invalid email format"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    phoneNumber: {
      type: String,
      required: [true, "Phone number is required"],
      match: [/^\d{10}$/, "Phone number must be 10 digits"],
    },
    age: {
      type: Number,
      required: [true, "Age is required"],
      min: [18, "You must be at least 18 years old"],
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: [true, "Gender is required"],
    },
    refreshToken: {
      type: String,
      required: [true, "Refresh Token is required"],
    },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", UserSchema);
