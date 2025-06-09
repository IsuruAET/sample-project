import { Request, Response } from "express";
import { TodoService } from "../services/TodoService";

export class TodoController {
  private todoService: TodoService;

  constructor() {
    this.todoService = new TodoService();
  }

  getAllTodos = async (req: Request, res: Response): Promise<void> => {
    try {
      const todos = await this.todoService.getAllTodos();
      res.status(200).json(todos);
    } catch (error) {
      res.status(500).json({
        message: "Error fetching todos",
        error: (error as Error).message,
      });
    }
  };

  getTodoById = async (req: Request, res: Response): Promise<void> => {
    try {
      const todo = await this.todoService.getTodoById(req.params.id);
      res.status(200).json(todo);
    } catch (error) {
      if ((error as Error).message === "Todo not found") {
        res.status(404).json({ message: "Todo not found" });
      } else {
        res.status(500).json({
          message: "Error fetching todo",
          error: (error as Error).message,
        });
      }
    }
  };

  createTodo = async (req: Request, res: Response): Promise<void> => {
    try {
      const todo = await this.todoService.createTodo(req.body);
      res.status(201).json(todo);
    } catch (error) {
      res.status(400).json({
        message: "Error creating todo",
        error: (error as Error).message,
      });
    }
  };

  updateTodo = async (req: Request, res: Response): Promise<void> => {
    try {
      const todo = await this.todoService.updateTodo(req.params.id, req.body);
      res.status(200).json(todo);
    } catch (error) {
      if ((error as Error).message === "Todo not found") {
        res.status(404).json({ message: "Todo not found" });
      } else {
        res.status(400).json({
          message: "Error updating todo",
          error: (error as Error).message,
        });
      }
    }
  };

  deleteTodo = async (req: Request, res: Response): Promise<void> => {
    try {
      const todo = await this.todoService.deleteTodo(req.params.id);
      res.status(200).json({ message: "Todo deleted successfully", todo });
    } catch (error) {
      if ((error as Error).message === "Todo not found") {
        res.status(404).json({ message: "Todo not found" });
      } else {
        res.status(500).json({
          message: "Error deleting todo",
          error: (error as Error).message,
        });
      }
    }
  };
}
