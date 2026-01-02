import { z } from "zod";

const colorSchema = z
  .string()
  .regex(
    /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$|^rgb\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*\)$|^hsl\(\s*\d{1,3}\s*,\s*\d{1,3}%\s*,\s*\d{1,3}%\s*\)$/,
    "Color must be hex, rgb(), or hsl().",
  )
  .optional()
  .nullable();

const isoDateTime = z.iso.datetime({ offset: true }); // expects a valid ISO 8601 string like

// Define the Todo schema
export const todoPayloadSchema = z.object({
  title: z.string().max(255).nonempty({
    error: "Can't be empty",
  }),
  description: z.string().max(500),
  tags: z
    .array(z.union([z.object({ value: z.string() }), z.string()]))
    .transform((items): string[] => {
      return items
        .map((item): string => {
          if (typeof item === "string") return item;
          return item.value;
        })
        .filter(Boolean);
    })
    .pipe(z.array(z.string().max(50).nonempty())),
  color: colorSchema,
  status: z.enum(["pending", "in-progress", "completed"]).default("pending"),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
  startsAt: isoDateTime.optional().nullable(),
  due: isoDateTime.optional().nullable(),
  createdAt: isoDateTime.default(() => new Date().toISOString()),
  updatedAt: isoDateTime.default(() => new Date().toISOString()),
  completedAt: isoDateTime.nullable().optional(),
  // recurrence
  isRecurring: z.boolean(),
  recurrenceRule: z.string().optional(),
});

export type CreateTodoPayload = z.infer<typeof todoPayloadSchema>;
