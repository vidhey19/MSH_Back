import mongoose, { Schema, Document } from "mongoose";

interface IBlog extends Document {
  title: string;
  description: string;
  score: number; // Score range (0-40)
  createdAt: Date;
}

const BlogSchema = new Schema<IBlog>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    score: { type: Number, required: true, min: 0, max: 40 }, // Score range validation
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model<IBlog>("Blog", BlogSchema);
