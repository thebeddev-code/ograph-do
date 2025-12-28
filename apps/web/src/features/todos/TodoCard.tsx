import { Todo } from "@/types/api";
import { useDeleteTodo } from "./api/deleteTodo";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { X as Close } from "lucide-react";

type Props = {
  todo: Todo;
  onShowExpandedView: (id: number) => void;
};

export function TodoCard({ todo, onShowExpandedView }: Props) {
  const { mutate: deleteTodo } = useDeleteTodo({
    mutationConfig: {
      onError: () => {
        toast.error("Failed to delete todo");
      },
    },
  });
  function handleDeleteTodo(todoId: number) {
    deleteTodo({ todoId });
  }
  const { title, due, priority, status, isRecurring } = todo;
  const isCompleted = status === "completed";

  return (
    <div
      className="flex items-center justify-between gap-3 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm hover:border-gray-300 transition cursor-pointer"
      onClick={() => onShowExpandedView(todo.id)}
    >
      {/* Left: checkbox + title */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
        }}
        className={`flex h-4 w-4 items-center justify-center rounded border text-[10px] ${
          isCompleted
            ? "border-emerald-500 bg-emerald-500 text-white"
            : "border-gray-300 bg-white text-transparent"
        }`}
        aria-label={isCompleted ? "Mark as incomplete" : "Mark as complete"}
      >
        ✓
      </button>

      <div className="flex min-w-0 flex-1 flex-col">
        <h3
          className={`truncate text-sm ${
            isCompleted ? "text-gray-400 line-through" : "text-gray-800"
          }`}
        >
          {title}
        </h3>

        <div className="mt-0.5 flex items-center gap-2 text-[12px] text-gray-400">
          {due && <span>{due}</span>}
          {priority && (
            <span
              className={
                priority === "high"
                  ? "text-red-400"
                  : priority === "medium"
                    ? "text-amber-400"
                    : "text-emerald-400"
              }
            >
              {priority}
            </span>
          )}
          {isRecurring && (
            <span className=" tracking-wide text-[12px]">recurring</span>
          )}
        </div>
      </div>

      <Button
        variant="outline"
        aria-label="Delete todo"
        title="Delete todo"
        size={"icon"}
        className="h-6 w-6 p-2 text-slate-700/20 border-gray-200/70 shadow-none hover:border-red-500 hover:text-red-600 transition-colors"
        onClick={(e) => {
          e.stopPropagation();
          handleDeleteTodo(todo.id);
        }}
      >
        <Close size={16} />
      </Button>
    </div>
  );
}
