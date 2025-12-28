"use client";
import { ClockGraph } from "@/features/graphs/ClockGraph";
import { useTodos } from "@/features/todos/api/getTodos";
import { TodoList } from "@/features/todos/TodoList";

export default function Dashboard() {
  const { data, status } = useTodos({});
  const todos = data?.data;
  return (
    <main>
      <div className="grid grid-cols-2">
        {status === "success" && todos && <ClockGraph todos={todos} />}
        {status === "success" && todos && <TodoList todos={todos} />}
      </div>
    </main>
  );
}
