import { z } from "zod";

const todoTimeSchema = z.object({
  hour: z.number().min(0).max(24),
  minutes: z.number().min(0).max(60),
});

// Define the Todo schema
const todoSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  tags: z.array(z.string()),
  color: z.string().nullable(),
  status: z.enum(["pending", "in-progress", "completed"]),
  priority: z.enum(["low", "medium", "high"]),
  time: z
    .object({
      start: z.object({}),
      end: todoTimeSchema,
    })
    .nullable(),
  due: z.string().nullable().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  completedAt: z.string().nullable().optional(),
  isRecurring: z.boolean(),
  recurrenceRule: z.string().nullable().optional(),
});

export type Todo = z.infer<typeof todoSchema>;
