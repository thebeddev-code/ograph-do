import { FaCalendarAlt, FaStar, FaChartLine, FaSyncAlt } from 'react-icons/fa';
import { formatDueDate, formatTimeToDoubleDigits } from '@/lib/utils/date';
import { IoIosTime } from 'react-icons/io';
import { Todo } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Trash } from 'lucide-react';
import { useDeleteTodo } from './api/deleteTodo';
import toast from 'react-hot-toast';

interface Props {
  todo: Todo;
  onShowExpandedView: (todoId: number) => void;
}

export function TodoCard({ todo, onShowExpandedView }: Props) {
  const { mutate: deleteTodo } = useDeleteTodo({
    mutationConfig: {
      onError: () => {
        toast.error('Failed to delete todo');
      },
    },
  });
  function handleDeleteTodo(todoId: number) {
    deleteTodo({ todoId });
  }

  const { title, due, priority, status, isRecurring } = todo;
  const { start, end } = todo.time ?? {};

  return (
    <div
      className="relative border-l-8 rounded-lg min-h-40 bg-white hover:shadow-lg transition-all transform hover:-translate-y-1 cursor-pointer"
      style={{
        borderColor: todo.color || '#9ca3af', // Fallback border color
      }}
      onClick={() => onShowExpandedView(todo.id)}
    >
      {/* Button */}
      <div className="top-0 w-full absolute flex justify-end items-center px-2 py-2">
        <Button
          variant="outline"
          aria-label="Delete todo"
          title="Delete todo"
          size={'icon'}
          className="text-slate-700/20 border-slate-700/20 hover:border-red-500 hover:text-red-600 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteTodo(todo.id);
          }}
        >
          <Trash size={16} />
        </Button>
      </div>

      {/* Main */}
      <div className="p-5">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          {title.length > 50 ? title.slice(0, 50) + '...' : title}
        </h3>

        {/* Indicators row */}
        <div className="flex flex-wrap gap-3 text-sm">
          {due && (
            <div className="flex items-center gap-2 bg-gray-50 text-slate-600 px-2 py-1 rounded-lg">
              <FaCalendarAlt className="text-slate-600" />
              <span>{formatDueDate(due)}</span>
            </div>
          )}

          <div className="flex items-center gap-2 bg-yellow-50 text-yellow-700 px-2 py-1 rounded-lg">
            <FaStar className="text-yellow-500" />
            <span className="capitalize">{priority}</span>
          </div>

          {todo.time && (
            <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-2 py-1 rounded-lg">
              <IoIosTime />
              <span className="capitalize">
                {formatTimeToDoubleDigits(start?.hour)}:
                {formatTimeToDoubleDigits(start?.minutes)}
              </span>
              -
              <span className="capitalize">
                {formatTimeToDoubleDigits(end?.hour)}:
                {formatTimeToDoubleDigits(end?.minutes)}
              </span>
            </div>
          )}

          <div className="flex items-center gap-2 bg-green-50 text-green-700 px-2 py-1 rounded-lg">
            <FaChartLine className="text-green-500" />
            <span className="capitalize">{status}</span>
          </div>

          {isRecurring && (
            <div className="flex items-center gap-2 bg-teal-50 text-teal-700 px-2 py-1 rounded-lg">
              <FaSyncAlt className="text-teal-600 animate-spin-slow" />
              <span>Recurring</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
