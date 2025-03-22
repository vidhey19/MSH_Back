import express, { type Request, type Response } from "express";
import Blog from "../models/Blog";

const router = express.Router();

// ✅ Add a Blog (Admin only)
router.post("/add", async (req: Request, res: Response) => {
  try {
    const { title, description, score } = req.body;

    // Validate score range
    if (score < 0 || score > 40) {
      return res
        .status(400)
        .json({ message: "Invalid score. Must be between 0-40" });
    }

    const newBlog = new Blog({
      title,
      description,
      score,
    });

    await newBlog.save();
    res.status(201).json({ message: "Blog added successfully", data: newBlog });
  } catch (error) {
    res.status(500).json({ message: "Error adding blog", error });
  }
});

// ✅ Get Blogs by Score
router.get("/:score", async (req: Request, res: Response) => {
  try {
    const score = parseInt(req.params.score);

    if (isNaN(score) || score < 0 || score > 40) {
      return res
        .status(400)
        .json({ message: "Invalid score. Must be between 0-40" });
    }

    // Find blogs matching the exact score
    const blogs = await Blog.find({ score });

    res
      .status(200)
      .json({ message: "Blogs retrieved successfully", data: blogs });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving blogs", error });
  }
});

// ✅ Get All Blogs (For Admin)
router.get("/", async (req: Request, res: Response) => {
  try {
    const blogs = await Blog.find();
    res
      .status(200)
      .json({ message: "Blogs retrieved successfully", data: blogs });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving blogs", error });
  }
});

export default router;
