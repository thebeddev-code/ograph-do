import { Todo } from "@/types/api";
import { randSoonDate, randTodo, randText } from "@ngneat/falso";
import { set } from "date-fns";

export const mockTodos: Todo[] = [
  {
    id: 1,
    title:
      "Take a break from gaming: Disconnect and recharge your energy for the next adventure.",
    description: randText({ maxCharCount: 500 }),
    tags: ["shopping", "urgent"],
    color: "#ffcc00",
    status: "in-progress",
    priority: "high",
    startsAt: set(new Date(), { hours: 8, minutes: 30 }).toISOString(),
    due: set(new Date(), { hours: 10, minutes: 30 }).toISOString(), // Valid future due date
    createdAt: new Date().toISOString(), // Valid creation date
    updatedAt: new Date().toISOString(), // Updated after creation
    isRecurring: false,
  },
];
