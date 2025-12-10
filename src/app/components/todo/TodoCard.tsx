import { FaCalendarAlt, FaStar, FaChartLine, FaSyncAlt } from "react-icons/fa";

interface Props {
  todo: Todo;
}

export function TodoCard({ todo }: Props) {
  const { title, due, priority, status, isRecurring } = todo;

  // Format the due date
  const formatDueDate = (dueDate?: string) => {
    if (!dueDate) return "";
    const today = new Date();
    const dueDateObj = new Date(dueDate);
    const oneDay = 24 * 60 * 60 * 1000;

    const diffDays = (dueDateObj.getTime() - today.getTime()) / oneDay;

    if (diffDays < 0) return "Overdue";
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";

    const weekDays = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const dueDay = weekDays[dueDateObj.getDay()];

    const currentWeek =
      today.getFullYear() === dueDateObj.getFullYear() &&
      today.getMonth() === dueDateObj.getMonth() &&
      Math.ceil((today.getDate() + 1) / 7) ===
        Math.ceil((dueDateObj.getDate() + 1) / 7);

    return currentWeek
      ? dueDay
      : dueDateObj.toLocaleDateString("en-US", {
          day: "2-digit",
          month: "short",
        });
  };

  return (
    <div
      className="border-l-8 rounded-lg min-h-40 bg-white hover:shadow-lg transition-all transform hover:-translate-y-1 cursor-pointer"
      style={{
        borderColor: todo.color || "#9ca3af", // Fallback border color
      }}
    >
      <div className="p-5">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          {title.length > 50 ? title.slice(0, 50) + "..." : title}
        </h3>

        {/* Indicators row */}
        <div className="flex flex-wrap gap-3 text-sm">
          {due && (
            <div className="flex items-center gap-2 bg-gray-50 text-slate-600 px-3 py-2 rounded-lg">
              <FaCalendarAlt className="text-slate-600" />
              <span>{formatDueDate(due)}</span>
            </div>
          )}

          <div className="flex items-center gap-2 bg-yellow-50 text-yellow-700 px-3 py-2 rounded-lg">
            <FaStar className="text-yellow-500" />
            <span className="capitalize">{priority}</span>
          </div>

          <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-2 rounded-lg">
            <FaChartLine className="text-green-500" />
            <span className="capitalize">{status}</span>
          </div>

          {isRecurring && (
            <div className="flex items-center gap-2 bg-teal-50 text-teal-700 px-3 py-2 rounded-lg">
              <FaSyncAlt className="text-teal-600 animate-spin-slow" />
              <span>Recurring</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
