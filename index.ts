import "dotenv/config";
import express, { Request, Response } from "express";
import mongoose from "mongoose";
import todoRouter from "./src/routes/todos.route";
import { errorHandler } from "./src/middlewares/error-handler";
import morgan from "morgan";
import logger from "./src/utils/error.logger";
import cors from "cors";
import userRouter from "./src/routes/user.route";
import { authenticate } from "./src/middlewares/auth-handler";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5000",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // if sending cookies
  })
);

// Express JSON parser
app.use(express.json());

// Routes
app.use("/todos", todoRouter);
app.use("/user", userRouter);

// Error handler
app.use(errorHandler);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello world from Typescript");
});

mongoose
  .connect(process.env.MONGODB_URI ?? "")
  .then(() => {
    console.log("✅ Connected to local MongoDB");
    app.listen(process.env.PORT, () => {
      console.log(`Server is running at http://localhost:${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  });
