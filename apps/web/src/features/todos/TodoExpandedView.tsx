import { X as Close } from "lucide-react";
import { twMerge, ClassNameValue } from "tailwind-merge";
import { Todo } from "@/lib/types";
import { formatDate } from "@/lib/utils/date";

function DateField({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex flex-col">
      <span className="text-sm font-semibold text-gray-500">{label}</span>
      <span className="text-gray-800">
        {value ? formatDate(new Date(value), "MM/dd/yyyy") : "—"}
      </span>
    </div>
  );
}

interface Props {
  todo: Todo;
  containerClassName?: ClassNameValue;
  onExpandedViewClose: () => void;
}
export function TodoExpandedView({
  todo,
  containerClassName = "max-w-md w-full",
  onExpandedViewClose,
}: Props) {
  const statusColors: Record<Todo["status"], string> = {
    pending: "bg-amber-50 text-amber-700",
    "in-progress": "bg-sky-50 text-sky-700",
    completed: "bg-emerald-50 text-emerald-700",
    overdue: "bg-rose-50 text-rose-700",
  };

  const priorityColors: Record<Todo["priority"], string> = {
    low: "bg-gray-50 text-gray-600",
    medium: "bg-amber-50 text-amber-700",
    high: "bg-rose-50 text-rose-700",
  };

  return (
    <div
      className={twMerge(
        "relative space-y-4 rounded-lg border border-gray-200 bg-white p-5 text-base shadow-sm",
        containerClassName,
      )}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Close */}
      <button
        onClick={onExpandedViewClose}
        className="absolute right-3 top-3 rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
        aria-label="Close"
      >
        <Close className="h-5 w-5" />
      </button>

      {/* Title + description */}
      <div className="pr-7">
        <h2 className="text-xl font-semibold text-gray-900">{todo.title}</h2>
        {todo.description && (
          <p className="mt-2 text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">
            {todo.description}
          </p>
        )}
      </div>

      {/* Status + priority */}
      <div className="flex flex-wrap gap-2">
        <span
          className={twMerge(
            "rounded-full px-3 py-1 text-xs font-medium",
            statusColors[todo.status],
          )}
        >
          {todo.status.replace("-", " ")}
        </span>

        <span
          className={twMerge(
            "rounded-full px-3 py-1 text-xs font-medium",
            priorityColors[todo.priority],
          )}
        >
          Priority: {todo.priority}
        </span>
      </div>

      {/* Tags */}
      {todo.tags?.length > 0 && (
        <div className="space-y-1">
          <h3 className="text-sm font-medium text-gray-500">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {todo.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-gray-50 px-2.5 py-0.5 text-xs text-gray-800"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Dates */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 text-sm">
        <DateField label="Due" value={todo.due} />
        <DateField label="Created" value={todo.createdAt} />
        <DateField label="Updated" value={todo.updatedAt} />
        {todo.completedAt && (
          <DateField label="Completed" value={todo.completedAt} />
        )}
      </div>

      {/* Recurrence */}
      <div className="space-y-1">
        <h3 className="text-sm font-medium text-gray-500">Recurrence</h3>
        <p className="text-sm text-gray-700">
          {todo.isRecurring
            ? todo.recurrenceRule || "Repeats"
            : "Not recurring"}
        </p>
      </div>
    </div>
  );
}
