import express, { type Request, type Response } from "express";
import Score from "../models/Score";

const router = express.Router();

// ✅ Store Score for a User
router.post("/add", async (req: Request, res: Response) => {
  try {
    const { userId, score } = req.body;

    if (!userId || score === undefined) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newScore = new Score({ userId, score });
    await newScore.save();

    res
      .status(201)
      .json({ message: "Score added successfully", data: newScore });
  } catch (error) {
    res.status(500).json({ message: "Error storing score", error });
  }
});

// ✅ Get Scores by User ID
router.get("/user/:userId", async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const scores = await Score.find({ userId });

    if (!scores.length) {
      return res.status(404).json({ message: "No scores found for this user" });
    }

    res
      .status(200)
      .json({ message: "Scores retrieved successfully", data: scores });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving scores", error });
  }
});

// ✅ Get Average Score of a User
router.get("/user/:userId/average", async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const scores = await Score.find({ userId });

    if (!scores.length) {
      return res.status(404).json({ message: "No scores found for this user" });
    }

    const totalScore = scores.reduce((sum, score) => sum + score.score, 0);
    const averageScore = totalScore / scores.length;

    res.status(200).json({ message: "Average score calculated", averageScore });
  } catch (error) {
    res.status(500).json({ message: "Error calculating average score", error });
  }
});

export default router;
