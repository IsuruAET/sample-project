import { Router } from "express";
import { TodoController } from "../controllers/TodoController";
import { body } from "express-validator";

const router = Router();
const todoController = new TodoController();

// Validation middleware
const validateTodo = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ max: 100 })
    .withMessage("Title cannot be more than 100 characters"),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ max: 500 })
    .withMessage("Description cannot be more than 500 characters"),
  body("completed")
    .optional()
    .isBoolean()
    .withMessage("Completed must be a boolean"),
];

// Routes
router.get("/", todoController.getAllTodos);
router.get("/:id", todoController.getTodoById);
router.post("/", validateTodo, todoController.createTodo);
router.put("/:id", validateTodo, todoController.updateTodo);
router.delete("/:id", todoController.deleteTodo);

export default router;
