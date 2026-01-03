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
import { motion, AnimatePresence } from "motion/react";
import { Plus } from "lucide-react";

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
          <div className="flex justify-center">
            <Button
              variant="secondary"
              className="w-30 border hover:border-blue-500"
            >
              <Plus className="text-slate-800" />
            </Button>
          </div>
        </DrawerTrigger>
        <DrawerContent
          aria-label="Create a new todo"
          role="region"
          className="min-w-[800px] overflow-y-auto p-0 border-0 bg-transparent transition-colors duration-200"
        >
          {showForm && (
            <motion.div
              className="bg-white p-4 "
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 30,
              }}
            >
              <DrawerHeader className="mb-4 p-4">
                <DrawerTitle className="text-center">Create todo</DrawerTitle>
                <DrawerDescription className="text-center">
                  Fill in the fields below to create a new todo.
                </DrawerDescription>
              </DrawerHeader>

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
            </motion.div>
          )}
        </DrawerContent>
      </Drawer>
    </div>
  );
}
