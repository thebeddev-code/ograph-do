'use client';
import { TodoCard } from './TodoCard';
import { useState } from 'react';
import { TodoExpandedView } from './TodoExpandedView';
import { useTodos } from './api/getTodos';
import { Todo } from '@/types/api';

function List({ todos }: { todos: Todo[] }) {
  const [expandedTodoId, setExpandedTodoId] = useState<null | number>(null);
  const expandedTodo = todos.find((t) => t.id == expandedTodoId);

  function handleShowTodoExpandedView(todoId: number) {
    setExpandedTodoId(todoId);
  }

  return (
    <>
      {expandedTodo && (
        <div
          onClick={() => setExpandedTodoId(null)}
          className="w-dvw h-dvh flex justify-center items-center absolute top-0 left-0 bg-black/50 z-20"
        >
          <TodoExpandedView
            todo={expandedTodo}
            onExpandedViewClose={() => setExpandedTodoId(null)}
          />{' '}
        </div>
      )}
      {todos.map((t) => {
        return (
          <TodoCard
            onShowExpandedView={handleShowTodoExpandedView}
            key={t.id}
            todo={t}
          />
        );
      })}
    </>
  );
}

export function TodoList() {
  const { data, status } = useTodos({});
  return (
    <div
      className="bg-gray-200 flex flex-col gap-6 p-10 
    overflow-y-scroll max-h-dvh rounded-xl shadow-lg w-full
    border border-gray-100/30"
    >
      {status === 'success' ? <List todos={data.data} /> : 'Loading'}
    </div>
  );
}
