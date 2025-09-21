import { NextFunction, Request, Response } from "express";
import { Todo } from "../models/todo.model";
import mongoose from "mongoose";
import logger from "../utils/error.logger";
import { AuthRequest } from "../middlewares/auth-handler";

export const getTodos = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.userId;

    const todos = await Todo.find({ userId });
    res.status(200).json(todos);
  } catch (err) {
    logger.error("Error fetching todos:", { error: err });
    next(err);
  }
};

export const getTodoById = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const authReq = req as AuthRequest; // cast to your custom type
    const userId = authReq.userId;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ error: "Invalid todo ID format" });
      return;
    }

    // Find the todo that belongs to this user
    const foundTodo = await Todo.findOne({ _id: id, userId });

    if (!foundTodo) {
      res.status(404).json({ error: "Todo not found" });
      return;
    }

    res.status(200).json(foundTodo);
  } catch (err) {
    logger.error("Error fetching todo by ID", { error: err });
    next(err);
  }
};

export const createTodo = async (
  req: Request<{}, { title: string }>, // req.body has a 'title'
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authReq = req as AuthRequest; // cast to your custom type
    const userId = authReq.userId; // get user ID
    const { title } = req.body;

    if (!title || typeof title !== "string") {
      res.status(400).json({ error: "Valid 'title' string is required" });
      return;
    }

    const trimmedTitle = title.trim();
    if (trimmedTitle.length === 0) {
      res
        .status(400)
        .json({ error: "Title cannot be empty or just whitespace" });
      return;
    }

    const newTodo = await Todo.create({
      title: trimmedTitle,
      completed: false,
      userId, // associate todo with the user
    });

    res.status(201).json(newTodo);
  } catch (err: any) {
    logger.error("Error creating todo", { error: err });

    if (err.name === "ValidationError") {
      res.status(400).json({
        error: "Validation failed",
        details: err.errors,
      });
      return;
    }

    next(err);
  }
};

export const updateTodo = async (
  req: Request<{ id: string }, { title?: string; completed?: boolean }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const authReq = req as AuthRequest; // cast to your custom type
    const userId = authReq.userId; // authenticated user ID

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ error: "Invalid Todo ID format" });
      return;
    }

    const { title, completed } = req.body;
    const updates: Record<string, unknown> = {};

    if (title !== undefined) {
      if (typeof title !== "string" || title.trim().length === 0) {
        res.status(400).json({ error: "Title must be a non-empty string" });
        return;
      }
      updates.title = title.trim();
    }

    if (completed !== undefined) {
      if (typeof completed !== "boolean") {
        res.status(400).json({ error: "Completed must be a boolean value" });
        return;
      }
      updates.completed = completed;
    }

    if (Object.keys(updates).length === 0) {
      res.status(400).json({ error: "No valid fields provided for update" });
      return;
    }

    // Update only the todo that belongs to this user
    const updatedTodo = await Todo.findOneAndUpdate(
      { _id: id, userId },
      updates,
      { new: true, runValidators: true }
    );

    if (!updatedTodo) {
      res.status(404).json({ error: "Todo not found or not owned by user" });
      return;
    }

    res.status(200).json(updatedTodo);
  } catch (err: any) {
    logger.error("Error updating todo", { error: err });

    if (err.name === "ValidationError") {
      res.status(400).json({ error: err.message });
      return;
    }

    next(err);
  }
};

export const deleteTodo = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const authReq = req as AuthRequest; // cast to your custom type
    const userId = authReq.userId;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ error: "Invalid Todo ID format" });
      return;
    }

    // Delete only the todo that belongs to this user
    const deletedTodo = await Todo.findOneAndDelete({ _id: id, userId });

    if (!deletedTodo) {
      res.status(404).json({ error: "Todo not found or not owned by user" });
      return;
    }

    res.status(204).send(); // No content
  } catch (err) {
    logger.error("Error deleting todo", { error: err });
    next(err);
  }
};
