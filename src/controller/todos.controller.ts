import { NextFunction, Request, Response } from "express";
import { Todo } from "../models/todo.model";
import mongoose from "mongoose";
import logger from "../utils/error.logger";

export const getTodos = async (
    req: Request, 
    res: Response,
    next: NextFunction,
): Promise<void> => {
  try {
    const todos = await Todo.find({});
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

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ error: "Invalid todo ID format" });
      return;
    }

    const foundTodo = await Todo.findById(id);

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
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
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
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

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

    const updatedTodo = await Todo.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedTodo) {
      res.status(404).json({ error: "Todo not found" });
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

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ error: "Invalid Todo ID format" });
      return;
    }

    const deletedTodo = await Todo.findByIdAndDelete(id);

    if (!deletedTodo) {
      res.status(404).json({ error: "Todo not found" });
      return;
    }

    res.status(204).send();
  } catch (err) {
    logger.error("Error deleting todo", { error: err });
    next(err);
  }
};
