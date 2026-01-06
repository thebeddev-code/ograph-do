import { Todo } from "@/types/api";
import { create } from "zustand";

export type TodoFormModes = "update" | "create" | "read-only" | null;
export type TodoFormTodoData<T> = T extends "update"
  ? Omit<Todo, "id"> & { id: string }
  : Partial<Todo>;
type TodoFormStore<T extends TodoFormModes> = {
  formMode: T;
  todoData: TodoFormTodoData<T>;
  changeFormType: (
    formMode: T,
    todoData?: TodoFormStore<T>["todoData"],
  ) => void;
};

export const useTodoForm = create<TodoFormStore<TodoFormModes>>((set) => ({
  formMode: null,
  todoData: {},
  changeFormType: (
    formMode: TodoFormModes,
    todoData?: TodoFormTodoData<TodoFormModes>,
  ) => {
    set(() => ({ formMode, todoData: todoData ?? {} }));
  },
}));
