"use client";
import { mockDays } from "~/lib/utils/mockData";
import { TodoCard } from "./todo/TodoCard";
import { useState } from "react";
import { TodoExpandedView } from "./todo/TodoExpandedView";

export function TodoList() {
  const [expandedTodoId, setExpandedTodoId] = useState<null | number>(null);
  const todos = mockDays[1];
  function handleShowTodoExpandedView(todoId: number) {
    setExpandedTodoId(todoId);
  }
  const expandedTodo = todos.find((t) => t.id == expandedTodoId);
  return (
    <div
      className="bg-gray-200 flex flex-col gap-6 p-10 
    overflow-y-scroll h-[95%] rounded-xl shadow-lg w-full
    border border-gray-400/30"
    >
      {expandedTodo && (
        <div
          onClick={() => setExpandedTodoId(null)}
          className="w-dvw h-dvh flex justify-center items-center absolute top-0 left-0 bg-black/50 z-20"
        >
          <TodoExpandedView
            todo={expandedTodo}
            onExpandedViewClose={() => setExpandedTodoId(null)}
          />{" "}
        </div>
      )}
      {todos
        .toSorted((t1, t2) => {
          const { hour: hour1 = 0, minutes: minutes1 = 0 } =
            t1.time?.start ?? {};
          const { hour: hour2 = 0, minutes: minutes2 = 0 } =
            t2.time?.start ?? {};

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
          <TodoCard
            onShowExpandedView={handleShowTodoExpandedView}
            key={t.id}
            todo={t}
          />
        ))}
    </div>
  );
}
