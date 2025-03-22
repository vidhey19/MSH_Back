import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userRoutes from "./routes/userRoutes";
import questionnaireRoutes from "./routes/questionnaireRoutes";
import scoreRoutes from "./routes/scoreRoutes";
import blogRoutes from "./routes/blogRoutes";

// Load environment variables
dotenv.config();

// Create Express app
const app: Application = express();

// Middleware
app.use(express.json()); // Parse JSON requests
app.use(cors()); // Enable CORS

// Routes
app.use("/api/users", userRoutes);
app.use("/api/questionnaire", questionnaireRoutes);
app.use("/api/score", scoreRoutes);
app.use("/api/blog", blogRoutes);

// Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI as string;
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Default route
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Mental Health Support App 🚀" });
});

// Export app instance
export default app;
