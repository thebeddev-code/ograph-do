import { Days } from "../types";

export const mockDays: Days = [
  [],
  [
    {
      id: 1,
      title: "Buy groceries",
      description: "Milk, eggs, bread, and fruits.",
      tags: ["shopping", "urgent"],
      color: "#ffcc00",
      status: "completed",
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
      due: "2025-12-10",
      createdAt: "2025-12-01T12:00:00Z",
      updatedAt: "2025-12-01T12:30:00Z",
      completedAt: "2025-12-01T15:00:00Z",
      isRecurring: false,
    },
    {
      id: 2,
      title: "Complete project report",
      description: "Finalize and submit the report to the team.",
      tags: ["work", "report"],
      color: "#4caf50",
      status: "in-progress",
      priority: "medium",
      time: {
        start: {
          hour: 8,
          minutes: 30,
        },
        end: {
          hour: 10,
          minutes: 0,
        },
      },
      due: "2025-12-15",
      createdAt: "2025-12-02T09:00:00Z",
      updatedAt: "2025-12-05T11:00:00Z",
      completedAt: null,
      isRecurring: false,
    },

    {
      id: 3,
      title: "Morning workout",
      description: "30 minutes of cardio and stretching.",
      tags: ["health", "fitness"],
      color: "#2196f3",
      status: "pending",
      priority: "low",
      time: {
        start: {
          hour: 17,
          minutes: 0,
        },
        end: {
          hour: 19,
          minutes: 0,
        },
      },
      due: "2025-12-05",
      createdAt: "2025-12-01T08:00:00Z",
      updatedAt: "2025-12-01T08:00:00Z",
      completedAt: null,
      isRecurring: true,
    },
    {
      id: 4,
      title: "Send client invoice",
      description: "Email the invoice to client for the completed project.",
      tags: ["finance", "work"],
      color: "#ff5722",
      status: "in-progress",
      priority: "high",
      time: {
        start: {
          hour: 21,
          minutes: 0,
        },
        end: {
          hour: 23,
          minutes: 0,
        },
      },
      due: "2025-12-10",
      createdAt: "2025-12-01T13:00:00Z",
      updatedAt: "2025-12-03T10:15:00Z",
      completedAt: null,
      isRecurring: false,
    },
  ],
];
