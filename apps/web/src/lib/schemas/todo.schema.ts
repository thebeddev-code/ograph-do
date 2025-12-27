import { z } from 'zod';

const todoTimeSchema = z.object({
  hour: z.number().min(0).max(24),
  minutes: z.number().min(0).max(60),
});

// Define the Todo schema
export const todoSchema = z.object({
  title: z.string(),
  description: z.string(),
  tags: z.array(z.string()),
  color: z.string().nullable(),
  status: z.enum(['pending', 'in-progress', 'completed']).nullable(),
  priority: z.enum(['low', 'medium', 'high']).nullable(),
  time: z
    .object({
      start: todoTimeSchema,
      end: todoTimeSchema,
    })
    .nullable(),
  due: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  completedAt: z.string().optional(),
  isRecurring: z.boolean(),
  recurrenceRule: z.string().optional(),
});

export type CreateTodoPayload = z.infer<typeof todoSchema>;
