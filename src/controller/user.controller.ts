import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { User } from "../models/user.model";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET ?? "your-secret-key";

export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userName, password } = req.body;

  // === Validate userName ===
  if (
    !userName ||
    typeof userName !== "string" ||
    userName.trim().length === 0
  ) {
    res.status(400).json({ error: "Valid 'userName' string is required" });
    return;
  }

  // === Validate password ===
  if (!password || typeof password !== "string" || password.length < 6) {
    res
      .status(400)
      .json({ error: "Password must be at least 6 characters long" });
    return;
  }

  try {
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({
      userName: userName.trim(),
      password: hashedPassword,
    });

    await user.save(); // Important: wait for save to complete

    res.status(201).json({ message: "User registered successfully" });
  } catch (error: any) {
    if (error.code === 11000) {
      // Duplicate username error from MongoDB
      res.status(409).json({ error: "Username already exists" });
    } else {
      console.error("Error registering user:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

export const loginUser = async (
  req: Request,
  res: Response
): Promise<unknown> => {
  const { userName, password } = req.body;

  try {
    const user = await User.findOne({ userName });

    if (!user) {
      return res.status(401).json({ error: "Invalid userName or password" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid userName or password" });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};
