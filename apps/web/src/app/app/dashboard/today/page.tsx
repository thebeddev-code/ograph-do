"use client";
import { ClockGraph } from "@/features/graphs/ClockGraph";
import { useTodos } from "@/features/todos/api/getTodos";
import { TodoFormWrapper } from "@/features/todos/TodoFormWrapper";
import { TodoList } from "@/features/todos/TodoList";

export default function Dashboard() {
  const { data, status } = useTodos({
    params: {
      due: "today",
    },
  });
  const todos = data?.data;
  return (
    <main className="flex-1 grid grid-cols-2">
      {status === "success" && todos && <ClockGraph todos={todos} />}
      {status === "success" && todos && <TodoList todos={todos} />}
      <TodoFormWrapper />
    </main>
  );
}
