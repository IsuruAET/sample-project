import { ITodo } from "../models/Todo";
import { TodoRepository } from "../repositories/TodoRepository";

export class TodoService {
  private todoRepository: TodoRepository;

  constructor() {
    this.todoRepository = new TodoRepository();
  }

  async getAllTodos(): Promise<ITodo[]> {
    return this.todoRepository.findAll();
  }

  async getTodoById(id: string): Promise<ITodo | null> {
    const todo = await this.todoRepository.findById(id);
    if (!todo) {
      throw new Error("Todo not found");
    }
    return todo;
  }

  async createTodo(todoData: Partial<ITodo>): Promise<ITodo> {
    return this.todoRepository.create(todoData);
  }

  async updateTodo(
    id: string,
    todoData: Partial<ITodo>
  ): Promise<ITodo | null> {
    const todo = await this.todoRepository.findById(id);
    if (!todo) {
      throw new Error("Todo not found");
    }
    return this.todoRepository.update(id, todoData);
  }

  async deleteTodo(id: string): Promise<ITodo | null> {
    const todo = await this.todoRepository.findById(id);
    if (!todo) {
      throw new Error("Todo not found");
    }
    return this.todoRepository.delete(id);
  }
}
