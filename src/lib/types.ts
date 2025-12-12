type TodoTime = {
  hour: number;
  minutes: number;
};

type Todo = {
  id: number;
  title: string;
  description: string;
  tags: string[];
  color: string | null;
  status: "pending" | "in-progress" | "completed" | "overdue";
  priority: "low" | "medium" | "high";
  time: {
    start: TodoTime;
    end: TodoTime;
  } | null;
  // Only with the precision to the day
  due?: string | null;
  createdAt: string;
  updatedAt: string;
  completedAt?: string | null;
  isRecurring: boolean;
  // e.g "RRULE:FREQ=WEEKLY;BYDAY=MO,WE,FR"
  recurrenceRule?: string | null;
};

type Days = Todo[][];
