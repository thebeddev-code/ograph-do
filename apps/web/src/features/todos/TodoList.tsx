"use client";
import { TodoCard } from "./TodoCard";
import { useState } from "react";
import { TodoExpandedView } from "./TodoExpandedView";
import { Todo } from "@/types/api";
import TodoForm from "./TodoForm";

export function TodoList({ todos }: { todos: Todo[] }) {
  const [expandedTodoId, setExpandedTodoId] = useState<null | number>(null);
  const expandedTodo = todos.find((t) => t.id == expandedTodoId);

  function handleShowTodoExpandedView(todoId: number) {
    setExpandedTodoId(todoId);
  }
  return (
    <div className="flex h-dvh w-full flex-col gap-2 overflow-y-auto rounded-lg bg-gray-50 p-4 border border-gray-200">
      {expandedTodo && (
        <div
          onClick={() => setExpandedTodoId(null)}
          className="fixed inset-0 z-20 flex items-center justify-center bg-black/40"
        >
          <TodoExpandedView
            todo={expandedTodo}
            onExpandedViewClose={() => setExpandedTodoId(null)}
          />
        </div>
      )}
      {todos.map((t) => (
        <TodoCard
          key={t.id}
          todo={t}
          onShowExpandedView={handleShowTodoExpandedView}
        />
      ))}
      <div className="absolute z-20 shadow px-10 overflow-y-scroll bg-white min-w-[50%] h-dvh top-0 right-0">
        <TodoForm formType="create" />
      </div>
    </div>
  );
}
