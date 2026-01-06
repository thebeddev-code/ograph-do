"use client";
import { TodoItem } from "./TodoItem";
import { useState } from "react";
import { TodoExpandedView } from "./TodoExpandedView";
import { Todo } from "@/types/api";
import { useTodoForm } from "./stores/todo-form.store";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function TodoList({ todos }: { todos: Todo[] }) {
  const changeFormType = useTodoForm((state) => state.changeFormType);
  const [expandedTodoId, setExpandedTodoId] = useState<null | number>(null);
  const [showForm, setShowForm] = useState(false);

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
        <TodoItem
          key={t.id}
          todo={t}
          onShowExpandedView={handleShowTodoExpandedView}
        />
      ))}

      <div className="flex justify-center">
        <Button
          onClick={() => changeFormType("create")}
          variant="secondary"
          className="w-30 border hover:border-blue-500"
        >
          <Plus className="text-slate-800" />
        </Button>
      </div>
    </div>
  );
}
