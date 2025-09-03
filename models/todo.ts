export interface Todo {
    id: number;
    title: string;
    completed: boolean;
}

export interface CreateTodoRequest {
    title: string;
    completed: boolean;
}

export interface TodoParams {
    id: string;
}

interface UpdateTodoRequest {
  title?: string;   // Optional properties
  completed?: boolean;
}
