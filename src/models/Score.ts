import mongoose, { Schema, Document } from "mongoose";

interface IScore extends Document {
  userId: mongoose.Types.ObjectId;
  questionnaireId: mongoose.Types.ObjectId;
  score: number;
  createdAt: Date;
}

const ScoreSchema = new Schema<IScore>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    score: { type: Number, required: true, min: 0, max: 40 }, // Score should be a positive number
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model<IScore>("Score", ScoreSchema);
