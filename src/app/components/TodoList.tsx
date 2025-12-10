import { mockDays } from "~/lib/utils/mockData";
import { TodoCard } from "./todo/TodoCard";

export function TodoList() {
  const todos = mockDays[1];

  return (
    <div
      className="bg-gray-200 flex flex-col gap-6 p-10 
    overflow-y-scroll h-[95%] rounded-xl shadow-lg w-full
    border border-gray-400/30"
    >
      {todos
        .toSorted((t1, t2) => {
          const { hour: hour1, minutes: minutes1 } = t1.time.start;
          const { hour: hour2, minutes: minutes2 } = t2.time.start;

          const d1 =
            new Date(t1.due ?? 0).getTime() + (24 - hour1) + (60 - minutes1);
          const d2 =
            new Date(t2.due ?? 0).getTime() + (24 - hour2) + (60 - minutes2);

          const c1 = new Date(t1.createdAt ?? 0).getTime();
          const c2 = new Date(t2.createdAt ?? 0).getTime();

          // Sort primarily by due date, fallback to createdAt if due dates are missing or equal
          if (t1.due && t2.due && d1 !== d2) {
            return d2 - d1;
          }

          // If one has due date and the other doesn't, prioritize the one *with* due date
          if (t1.due && !t2.due) return -1;
          if (!t1.due && t2.due) return 1;

          // Fallback: sort by creation date
          return c2 - c1;
        })
        .map((t) => (
          <TodoCard key={t.id} todo={t} />
        ))}
    </div>
  );
}
