import { motion } from "motion/react";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

import { useTodoForm } from "./stores/todoForm.store";
import TodoForm from "./TodoForm";

export function TodoFormWrapper() {
  const { formMode, todoData, changeFormType } = useTodoForm((state) => state);
  const toggleForm = () => changeFormType(null);
  const showForm = Boolean(formMode);
  return (
    <Drawer open={showForm} onOpenChange={toggleForm}>
      <DrawerContent
        aria-label="Create a new todo"
        role="region"
        className="min-w-[650px] overflow-y-auto p-0 border-0 bg-transparent transition-colors duration-200"
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
              todoData={todoData}
              formMode={formMode}
              renderButtons={() => (
                <DrawerFooter>
                  <div className="flex w-full justify-center gap-6 pt-10">
                    <Button className="px-10" type="submit" form="todo-form">
                      {formMode === "create" ? "Create" : "Save"}
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
  );
}
