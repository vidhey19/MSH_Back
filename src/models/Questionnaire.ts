import mongoose, { Schema, Document } from "mongoose";

interface IQuestionnaire extends Document {
  type: string;
  question: string;
  answerOptions: string[];
}

const QuestionnaireSchema = new Schema<IQuestionnaire>({
  type: { type: String, required: true },
  question: { type: String, required: true },
  answerOptions: { type: [String], required: true },
});

export default mongoose.model<IQuestionnaire>(
  "Questionnaire",
  QuestionnaireSchema
);
