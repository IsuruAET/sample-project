import { ITodo } from "../models/Todo";
import Todo from "../models/Todo";

export class TodoRepository {
  async findAll(): Promise<ITodo[]> {
    return Todo.find().sort({ createdAt: -1 });
  }

  async findById(id: string): Promise<ITodo | null> {
    return Todo.findById(id);
  }

  async create(todoData: Partial<ITodo>): Promise<ITodo> {
    const todo = new Todo(todoData);
    return todo.save();
  }

  async update(id: string, todoData: Partial<ITodo>): Promise<ITodo | null> {
    return Todo.findByIdAndUpdate(id, todoData, {
      new: true,
      runValidators: true,
    });
  }

  async delete(id: string): Promise<ITodo | null> {
    return Todo.findByIdAndDelete(id);
  }
}
