import { Todo } from "@/types/api";
export type DrawableTodo = Pick<Todo, "color" | "startsAt" | "due">;
