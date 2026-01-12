"use client";
import { ClockGraph } from "@/features/graphs/components/ClockGraph/ClockGraph";
import { useTodos } from "@/features/todos/api/getTodos";
import { useTodoForm } from "@/features/todos/stores/todoForm.store";
import { TodoFormWrapper } from "@/features/todos/TodoFormWrapper";
import { TodoList } from "@/features/todos/TodoList";

export default function Dashboard() {
  const { data, status } = useTodos({
    params: {
      due: "today",
    },
  });
  const changeFormType = useTodoForm((state) => state.changeFormType);
  const todos = data?.data;
  return (
    <main className="flex-1 grid grid-cols-2">
      {status === "success" && todos && (
        <ClockGraph
          todos={todos}
          onFormOpen={(data) => {
            changeFormType("create", data);
          }}
        />
      )}
      {status === "success" && todos && <TodoList todos={todos} />}
      <TodoFormWrapper />
    </main>
  );
}
