import { CgClose } from "react-icons/cg";
import { twMerge, ClassNameValue } from "tailwind-merge";
import { Todo } from "~/lib/types";
import { formatDate } from "~/lib/utils/date";

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
  containerClassName = "w-[50%]",
  onExpandedViewClose,
}: Props) {
  // Badge styles
  const statusColors: Record<Todo["status"], string> = {
    pending: "bg-yellow-100 text-yellow-700",
    "in-progress": "bg-blue-100 text-blue-700",
    completed: "bg-green-100 text-green-700",
    overdue: "bg-red-100 text-red-700",
  };

  const priorityColors: Record<Todo["priority"], string> = {
    low: "bg-gray-100 text-gray-600",
    medium: "bg-orange-100 text-orange-700",
    high: "bg-red-100 text-red-700",
  };

  return (
    <div
      className={twMerge(
        "relative rounded-xl border shadow-sm p-6 space-y-5 transition-all bg-white",
        containerClassName
      )}
      style={
        todo.color
          ? {
              borderColor: todo.color + "80",
              boxShadow: `0 4px 12px ${todo.color}30`,
            }
          : {}
      }
      onClick={(e) => e.stopPropagation()}
    >
      <button
        onClick={onExpandedViewClose}
        className="cursor-pointer text-gray-800 absolute right-4 top-4 bg-red-50 hover:bg-red-300 p-2 rounded-full"
      >
        <CgClose />
      </button>
      {/* Title */}
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">{todo.title}</h2>
        {todo.description && (
          <p className="text-gray-600 mt-2 whitespace-pre-wrap">
            {todo.description}
          </p>
        )}
      </div>

      {/* Status + Priority */}
      <div className="flex flex-wrap gap-3">
        <span
          className={twMerge(
            "px-3 py-1 rounded-full text-sm font-medium",
            statusColors[todo.status]
          )}
        >
          {todo.status.replace("-", " ")}
        </span>

        <span
          className={twMerge(
            "px-3 py-1 rounded-full text-sm font-medium",
            priorityColors[todo.priority]
          )}
        >
          Priority: {todo.priority}
        </span>
      </div>

      {/* Tags */}
      {todo.tags?.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-500 mb-1">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {todo.tags.map((tag) => (
              <span
                key={tag}
                className="bg-gray-200 text-gray-700 px-2 py-1 text-xs rounded-md"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Dates */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <DateField label="Due" value={todo.due} />
        <DateField label="Created" value={todo.createdAt} />
        <DateField label="Updated" value={todo.updatedAt} />
        {todo.completedAt && (
          <DateField label="Completed" value={todo.completedAt} />
        )}
      </div>

      {/* Recurrence */}
      <div>
        <h3 className="text-sm font-semibold text-gray-500 mb-1">Recurrence</h3>
        <p className="text-gray-700">
          {todo.isRecurring
            ? todo.recurrenceRule || "Repeats"
            : "Not recurring"}
        </p>
      </div>
    </div>
  );
}
