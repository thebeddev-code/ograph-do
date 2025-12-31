import { z } from "zod";

const colorSchema = z
  .string()
  .regex(
    /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$|^rgb\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*\)$|^hsl\(\s*\d{1,3}\s*,\s*\d{1,3}%\s*,\s*\d{1,3}%\s*\)$/,
    "Color must be hex, rgb(), or hsl().",
  )
  .nullable();

const isoDateTime = z.iso.datetime({ offset: true }); // expects a valid ISO 8601 string like

// Define the Todo schema
export const todoPayloadSchema = z.object({
  title: z.string().max(255).nonempty(),
  description: z.string().max(500),
  tags: z.array(z.string().max(50).nonempty()),
  color: colorSchema,
  status: z.enum(["pending", "in-progress", "completed"]).default("pending"),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
  startsAt: isoDateTime.optional().nullable(),
  due: isoDateTime.optional().nullable(),
  createdAt: isoDateTime,
  updatedAt: isoDateTime,
  completedAt: isoDateTime.nullable().optional(),
  // recurrence
  isRecurring: z.boolean(),
  recurrenceRule: z.string().optional(),
});

export type CreateTodoPayload = z.infer<typeof todoPayloadSchema>;
