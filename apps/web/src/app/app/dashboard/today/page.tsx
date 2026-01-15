"use client";
import { ClockGraph } from "@/features/graphs/components/ClockGraph/ClockGraph";
import { useTodos } from "@/features/todos/api/getTodos";
import { useTodoForm } from "@/features/todos/stores/todoForm.store";
import { TodoFormWrapper } from "@/features/todos/TodoFormWrapper";
import { TodoList } from "@/features/todos/TodoList";
import { addDays, set } from "date-fns";
import { useState } from "react";

export default function Dashboard() {
  const [currentDate, setCurrentDate] = useState(new Date());
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
          currentDate={currentDate}
          onMoveDate={(days) => {
            let date = set(currentDate, {
              hours: 0,
              minutes: 5,
              seconds: 0,
            });
            if (days < 0) {
              date = set(currentDate, {
                hours: 23,
                minutes: 55,
                seconds: 0,
              });
            }
            setCurrentDate(addDays(date, days));
          }}
        />
      )}
      {status === "success" && todos && <TodoList todos={todos} />}
      <TodoFormWrapper />
    </main>
  );
}
