import { Todo } from "@/types/api";
import { create } from "zustand";

type FormMode = "update" | "create" | "read-only" | null;
type TodoFormStore = {
  formMode: FormMode;
  todoData: Partial<Todo>;
  changeFormType: (formMode: FormMode, todoData?: Partial<Todo>) => void;
};

export const useTodoForm = create<TodoFormStore>((set) => ({
  formMode: null,
  todoData: {},
  changeFormType: (formMode: FormMode, todoData: Partial<Todo> = {}) => {
    set(() => ({ formMode, todoData: todoData }));
  },
}));
