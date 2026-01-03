"use client";
import { TodoCard } from "./TodoCard";
import { useState } from "react";
import { TodoExpandedView } from "./TodoExpandedView";
import { Todo } from "@/types/api";
import TodoForm from "./TodoForm";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

export function TodoList({ todos }: { todos: Todo[] }) {
  const [expandedTodoId, setExpandedTodoId] = useState<null | number>(null);
  const [showForm, setShowForm] = useState(false);
  const toggleForm = () => setShowForm((b) => !b);

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

      <Drawer open={showForm} onOpenChange={toggleForm}>
        <DrawerTrigger asChild>
          <Button variant="outline">Create todo</Button>
        </DrawerTrigger>

        <DrawerContent
          className="min-w-[800px] overflow-y-auto"
          aria-label="Create a new todo"
          role="region"
        >
          <DrawerHeader className="mb-4 p-4">
            <DrawerTitle>Create todo</DrawerTitle>
            <DrawerDescription>
              Fill in the fields below to create a new todo.
            </DrawerDescription>
          </DrawerHeader>

          <div>
            <TodoForm
              formType="create"
              renderButtons={() => (
                <DrawerFooter>
                  <div className="flex w-full justify-center gap-6 pt-10">
                    <Button className="px-10" type="submit" form="todo-form">
                      Create
                    </Button>
                  </div>
                </DrawerFooter>
              )}
              onFormClose={toggleForm}
            />
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
