import { z } from "zod";

export const createTodoSchema = z.object({
  body: z.object({
    title: z.string().min(1, "Title is required").max(100, "Title too long"),
    description: z.string().max(500, "Description too long").optional(),
    completed: z.boolean().default(false),
    dueDate: z.string().datetime().optional(),
  }),
});

export const updateTodoSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Todo ID is required"),
  }),
  body: z
    .object({
      title: z
        .string()
        .min(1, "Title is required")
        .max(100, "Title too long")
        .optional(),
      description: z.string().max(500, "Description too long").optional(),
      completed: z.boolean().optional(),
      dueDate: z.string().datetime().optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one field must be provided for update",
    }),
});

export const getTodoSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Todo ID is required"),
  }),
});
