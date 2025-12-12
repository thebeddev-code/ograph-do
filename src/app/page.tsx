import { ClockGraph } from "./components/ClockGraph";
import { TodoList } from "./components/TodoList";

export default function Home() {
  return (
    <div>
      <h1>Your todos</h1>
      <main className="bg-white grid grid-cols-[40%_1fr] gap-20 justify-center items-center h-dvh w-dvw px-10">
        <TodoList />
        <div className="flex max-w-full">
          <ClockGraph />
        </div>
      </main>
    </div>
  );
}
