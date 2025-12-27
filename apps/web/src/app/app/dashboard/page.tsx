import { ClockGraph } from '@/features/graphs/ClockGraph';
import { TodoList } from '@/features/todos/TodoList';
import { mockDays } from '@/lib/utils/mockData';

export default function Dashboard() {
  return (
    <main className="grid grid-cols-2">
      <TodoList />
      <ClockGraph days={mockDays} />
    </main>
  );
}
