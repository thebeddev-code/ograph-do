import { ListTodo, CalendarDays } from "lucide-react";
import { useState } from "react";

type Section = "todos" | "calendar";

export function Sidebar() {
  const [activeSection, setActiveSection] = useState<Section>("todos");
  const isTodosOpen = activeSection === "todos";
  function handleChangeSection(section: Section) {}
  return (
    <aside className="flex h-dvh w-64 flex-col border-r border-gray-200 bg-white px-4 py-4 text-sm">
      {/* App / logo */}
      <div className="mb-4 flex items-center gap-2">
        <div className="h-7 w-7 rounded-md bg-gray-900" />
        <span className="font-semibold text-gray-900">Todos</span>
      </div>

      {/* Two-column menu */}
      <div className="flex flex-1">
        {/* Main menu */}
        <nav className="flex w-12 flex-col gap-2">
          <button
            type="button"
            onClick={() => handleChangeSection("todos")}
            className={`flex items-center justify-center rounded-md p-2 hover:bg-gray-50 ${
              isTodosOpen ? "bg-gray-100 text-gray-900" : "text-gray-600"
            }`}
            aria-label="Todos"
          >
            <ListTodo className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => handleChangeSection("calendar")}
            className={`mt-1 flex items-center justify-center rounded-md p-2 hover:bg-gray-50 ${
              activeSection === "calendar"
                ? "bg-gray-100 text-gray-900"
                : "text-gray-600"
            }`}
            aria-label="Calendar"
          >
            <CalendarDays className="h-4 w-4" />
          </button>
        </nav>

        {/* Submenu */}
        <nav className="ml-3 flex-1">
          {isTodosOpen && (
            <div className="mt-1 flex flex-col gap-1">
              <button className="flex items-center gap-2 rounded-md px-2 py-1.5 text-gray-600 hover:bg-gray-50">
                <span>All</span>
              </button>
              <button className="flex items-center gap-2 rounded-md px-2 py-1.5 bg-gray-100 text-gray-900">
                <span>Today</span>
              </button>
              <button className="flex items-center gap-2 rounded-md px-2 py-1.5 text-gray-600 hover:bg-gray-50">
                <span>Upcoming</span>
              </button>
              <button className="flex items-center gap-2 rounded-md px-2 py-1.5 text-gray-600 hover:bg-gray-50">
                <span>Completed</span>
              </button>
            </div>
          )}

          {activeSection === "calendar" && (
            <div className="mt-1 flex flex-col gap-1">
              <span className="px-2 py-1.5 text-gray-500">
                Calendar view (no sub-items yet)
              </span>
            </div>
          )}
        </nav>
      </div>
    </aside>
  );
}
