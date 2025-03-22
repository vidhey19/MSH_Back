import express, { type Request, type Response } from "express";
import Questionnaire from "../models/Questionnaire";

const router = express.Router();

// ✅ Add Multiple Questions at Once
router.post("/add", async (req: Request, res: Response) => {
  try {
    const questions = req.body; // Expecting array of questions

    if (!Array.isArray(questions)) {
      return res.status(400).json({ message: "Invalid data format" });
    }

    // Insert into DB
    const savedQuestions = await Questionnaire.insertMany(questions);

    res
      .status(201)
      .json({ message: "Questions added successfully", data: savedQuestions });
  } catch (error) {
    res.status(500).json({ message: "Error adding questions", error });
  }
});

// ✅ Get All Questions
router.get("/all", async (req: Request, res: Response) => {
  try {
    const questions = await Questionnaire.find();
    res
      .status(200)
      .json({ message: "Questions retrieved successfully", data: questions });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving questions", error });
  }
});

// ✅ Get Question by Type
router.get("/type/:type", async (req: Request, res: Response) => {
  try {
    const { type } = req.params;
    const questions = await Questionnaire.find({ type });

    if (questions.length === 0) {
      return res
        .status(404)
        .json({ message: "No questions found for this type" });
    }

    res
      .status(200)
      .json({ message: "Questions retrieved successfully", data: questions });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving questions", error });
  }
});

export default router;
