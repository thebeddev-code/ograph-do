import { Todo } from "@/types/api";
import { randSoonDate, randTodo, randText } from "@ngneat/falso";

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
    time: {
      start: {
        hour: 6,
        minutes: 30,
      },
      end: {
        hour: 8,
        minutes: 0,
      },
    },
    due: randSoonDate({ days: 14 }).toISOString(), // Valid future due date
    createdAt: new Date().toISOString(), // Valid creation date
    updatedAt: randSoonDate({ days: 5 }).toISOString(), // Updated after creation
    isRecurring: false,
  },
  {
    id: 2,
    title:
      "Review a patient's medical history: Be prepared for any potential health concerns.",
    description: randText({ maxCharCount: 500 }),
    tags: ["work", "report"],
    color: "#4caf50",
    status: "in-progress",
    priority: "medium",
    time: {
      start: {
        hour: 18,
        minutes: 30,
      },
      end: {
        hour: 21,
        minutes: 0,
      },
    },
    due: randSoonDate({ days: 14 }).toISOString(), // Valid future due date
    createdAt: new Date().toISOString(), // Correct date format
    updatedAt: randSoonDate({ days: 5 }).toISOString(), // Valid update date
    isRecurring: false,
  },
  {
    id: 3,
    title:
      "Become a language whiz: Learn basic greetings in a new language you've always wanted to speak.",
    description: randText({ maxCharCount: 500 }),
    tags: ["health", "fitness"],
    color: "#2196f3",
    status: "pending",
    priority: "low",
    time: {
      start: {
        hour: 10,
        minutes: 0,
      },
      end: {
        hour: 12,
        minutes: 0,
      },
    },
    due: randSoonDate({ days: 14 }).toISOString(), // Valid future due date
    createdAt: new Date().toISOString(), // Valid creation date
    updatedAt: randSoonDate({ days: 5 }).toISOString(), // Must be after createdAt
    isRecurring: true,
  },
  {
    id: 4,
    title: "Finish reading assigned book",
    description: randText({ maxCharCount: 500 }),
    tags: ["finance", "work"],
    color: "#ff5722",
    status: "in-progress",
    priority: "high",
    time: {
      start: {
        hour: 14,
        minutes: 0,
      },
      end: {
        hour: 15,
        minutes: 0,
      },
    },
    due: randSoonDate({ days: 14 }).toISOString(), // Valid due date
    createdAt: new Date().toISOString(), // Valid creation date
    updatedAt: randSoonDate({ days: 5 }).toISOString(), // Must be after createdAt
    isRecurring: false,
  },
];
