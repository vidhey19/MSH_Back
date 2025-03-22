import express, { type Request, type Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/User";
import jwt from "jsonwebtoken";

const router = express.Router();

// Function to validate password format before hashing
const validatePassword = (password: string) => {
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

// Function to generate JWT token
const generateAuthToken = (userId: string) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET as string, {
    expiresIn: "15m", // 15 minutes expiration
  });
};

// Function to generate Refresh Token
const generateRefreshToken = (userId: string) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET as string, {
    expiresIn: "7d", // 7 days expiration
  });
};

// ✅ Middleware to Verify Token
const authenticateUser = async (
  req: Request,
  res: Response,
  next: Function
) => {
  try {
    const token = req.header("Authorization")?.split(" ")[1]; // Bearer token
    if (!token) {
      return res
        .status(401)
        .json({ message: "Access denied. No token provided." });
    }

    // Verify Token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      userId: string;
    };
    req.user = { id: decoded.userId };
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// Register API
router.post("/register", async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, password, phoneNumber, age, gender } =
      req.body;

    // Validate the password
    if (!validatePassword(password)) {
      return res.status(400).json({
        message:
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character, and be at least 8 characters long.",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate tokens
    const authToken = generateAuthToken(email);
    const refreshToken = generateRefreshToken(email);

    // Save user to database
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phoneNumber,
      age,
      gender,
      refreshToken, // Store refresh token
    });

    await newUser.save();

    res.status(201).json({
      message: "User registered successfully",
      authToken,
      refreshToken,
    });
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error });
  }
});

// Login API
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate new tokens
    const authToken = generateAuthToken(user._id.toString());
    const refreshToken = generateRefreshToken(user._id.toString());

    // Update refresh token in database
    user.refreshToken = refreshToken;
    await user.save();

    res.status(200).json({ authToken, refreshToken });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
});

// Logout API
router.post(
  "/logout",
  authenticateUser,
  async (req: Request, res: Response) => {
    try {
      // Remove refresh token from database
      await User.findByIdAndUpdate(req.user.id, { refreshToken: null });

      res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error logging out", error });
    }
  }
);

// Profile API
router.get(
  "/profile",
  authenticateUser,
  async (req: Request, res: Response) => {
    try {
      const user = await User.findById(req.user.id).select(
        "-password -refreshToken"
      ); // Exclude sensitive fields

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({ message: "Profile fetched successfully", user });
    } catch (error) {
      res.status(500).json({ message: "Error fetching profile", error });
    }
  }
);

export default router;
