import z from 'zod';
import { todoPayloadSchema } from '@/lib/schemas/todo.schema';

export const todoModel = z.object({
  id: z.number(),
  ...todoPayloadSchema.shape,
});

export type TodoModel = z.infer<typeof todoModel>;

export const userModel = z.object({
  id: z.number(),
  email: z.string(),
});
