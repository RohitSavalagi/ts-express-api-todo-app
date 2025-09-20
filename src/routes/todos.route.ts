import { Router } from "express";
import {
  createTodo,
  deleteTodo,
  getTodoById,
  getTodos,
  updateTodo,
} from "../controller/todos.controller";
import { authenticate } from "../middlewares/auth-handler";

const todoRouter = Router();

todoRouter.get("/", authenticate, getTodos);

todoRouter.get("/:id", authenticate, getTodoById);

todoRouter.post("/", authenticate, createTodo);

todoRouter.put("/:id", authenticate, updateTodo);

todoRouter.delete("/:id", authenticate, deleteTodo);

export default todoRouter;
