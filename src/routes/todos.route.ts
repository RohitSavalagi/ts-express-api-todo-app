import { Router } from "express";
import { createTodo, deleteTodo, getTodoById, getTodos, updateTodo } from "../controller/todos.contoller";

const todoRouter = Router();

todoRouter.get('/', getTodos);

todoRouter.get('/:id', getTodoById);

todoRouter.post('/', createTodo);

todoRouter.put('/:id', updateTodo);

todoRouter.delete('/:id', deleteTodo);

export default todoRouter;
