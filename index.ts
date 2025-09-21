import "dotenv/config";
import express, { Request, Response } from "express";
import mongoose from "mongoose";
import todoRouter from "./src/routes/todos.route";
import { errorHandler } from "./src/middlewares/error-handler";
import cors from "cors";
import userRouter from "./src/routes/user.route";

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: "https://bespoke-otter-cd8dbc.netlify.app", // no trailing slash
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Express JSON parser

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
