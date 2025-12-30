import { Todo } from "@/types/api";
import { randNumber, randTodo, randText, randHex } from "@ngneat/falso";
import { set } from "date-fns";

let id = 0;
export function createTodo(overrides: Partial<Todo>): Todo {
  const base = randTodo(); // has title, status, priority, etc.[web:45]
  const now = new Date();
  const startAtHours = overrides.startsAt
    ? new Date(overrides.startsAt).getHours()
    : randNumber({
        min: 0,
        max: 22,
      });

  const startAtMinutes = overrides.startsAt
    ? new Date(overrides.startsAt).getMinutes()
    : randNumber({
        min: 0,
        max: 50,
      });

  const startsAt = set(now, {
    hours: startAtHours,
    minutes: startAtMinutes,
    seconds: 0,
    milliseconds: 0,
  }).toISOString();

  const due = set(now, {
    hours: randNumber({ min: startAtHours + 1, max: 23 }),
    minutes: randNumber({ min: startAtMinutes, max: 60 }),
    seconds: 0,
    milliseconds: 0,
  }).toISOString();
  const priorities = ["high", "medium", "low"] as const;
  type Priority = (typeof priorities)[number]; // "high" | "medium" | "low"
  const priority: Priority = priorities[randNumber({ min: 0, max: 2 })];
  return {
    id: ++id,
    title: base.title,
    description: randText({ charCount: randNumber({ min: 50, max: 500 }) }),
    tags: randText({
      length: randNumber({ min: 1, max: 10 }),
      charCount: randNumber({ min: 4, max: 16 }),
    }),
    color: randHex(),
    status: "pending",
    priority,
    startsAt,
    due,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
    isRecurring: false,
    ...overrides,
  };
}

export const mockTodos: Todo[] = [
  createTodo({
    title: "Your todo",
    startsAt: set(new Date(), { hours: 19, minutes: 0 }).toISOString(),
  }),
];
