import 
    express, 
    { 
        Request, 
        Response,
    }
from 'express';
import { CreateTodoRequest, Todo, TodoParams } from './models/todo';

const app = express();
const port = 4000;

// middleware for parsing JSON
app.use(express.json());

// Define a Simple typed route
app.get(
    '/', 
    (req: Request, res: Response) => {
        res.send('Hello worild from Tyoescript');      
    }
);

// crud application
let todos: Todo[] = [];
let nextId: number = 1;

app.get('/todos', (req: Request, res: Response) => {
    res.status(200).json(todos);
})

app.get('/todos/:id', (req: Request<{ id: string }>, res: Response) => {
    const id: number = parseInt(req?.params?.id);
    const foundTodo = todos.find(todo => todo?.id === id);
    if (!foundTodo) {
        res.status(404).json({'error': 'Todo Not found'});
    }
    res.status(200).json(foundTodo);
})

app.post('/todos', (req: Request< {}, {}, CreateTodoRequest>, res: Response) => {
    const { title } = req?.body;

    if (!title || typeof title !== 'string') {
        return res.status(400).json({ error: "Valid 'title' string is required" });
    }

    const insertTodo: Todo = {
        completed: false,
        id: nextId++,
        title,
    };

    todos = [
        ...todos,
        insertTodo,
    ];

    res.status(201).json(todos);
})

app.put('/todos/:id', (req: Request<TodoParams, {}, CreateTodoRequest>, res: Response) => {
    const editableTodoId: number = parseInt(req?.params?.id);
    const { title, completed } = req.body;

     if (isNaN(editableTodoId)) {
        return res.status(400).json({ error: "ID must be a number" });
    }

    const todoIndex = todos.findIndex(todo => todo.id === editableTodoId);
  
    if (todoIndex === -1) {
        return res.status(404).json({ error: `Todo with id ${editableTodoId} not found` });
    }

    if (editableTodoId) {
        todos = todos?.map(todo => {
            if (todo?.id === editableTodoId) {
                return {
                    ...todo,
                    title: title ?? todo.title,
                    completed: completed ?? todo.completed,
                }
            }
            return todo;
        })

        res.status(200).json(todos);
    }
})

app.delete('/todos/:id', (req: Request<TodoParams>, res: Response) => {
    const deletingTodoId: number = parseInt(req?.params?.id);

    if (isNaN(deletingTodoId)) {
        return res.status(400).json({ error: "ID must be a number" });
    }

    const initialLength = todos.length;
    todos = todos.filter(todo => todo?.id !== deletingTodoId);
     if (todos.length === initialLength) {
        return res.status(404).json({ error: `Todo with id ${deletingTodoId} not found` });
    }
    res.status(204).send();
});

app.listen(port, () => {
    console.log('server is running at hhtp://localhost:4000');
});
