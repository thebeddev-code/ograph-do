import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';

import { getTodosQueryOptions } from './getTodos';
import { Todo } from '@/types/api';

export const deleteTodo = ({ todoId }: { todoId: number }) => {
  return api.delete(`/todos/${todoId}`);
};

type UseDeleteTodoOptions = {
  mutationConfig?: MutationConfig<typeof deleteTodo>;
};

export const useDeleteTodo = ({
  mutationConfig,
}: UseDeleteTodoOptions = {}) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};
  const queryKey = getTodosQueryOptions().queryKey;
  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey,
      });
      onSuccess?.(...args);
    },
    onMutate: async ({ todoId }, context) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await context.client.cancelQueries({ queryKey });

      // Snapshot the previous value
      const previousTodos = context.client.getQueryData(queryKey);

      // Optimistically update to the new value
      context.client.setQueryData(queryKey, (cache) =>
        cache
          ? {
              data: cache.data.filter((t) => t.id != todoId),
              meta: cache.meta,
            }
          : cache,
      );

      // Return a result with the snapshotted value
      return { previousTodos };
    },
    // If the mutation fails,
    // use the result returned from onMutate to roll back
    onError: (_, __, onMutateResult, context) => {
      context.client.setQueryData(
        ['todos'],
        (onMutateResult as { previousTodos: Todo[] })?.previousTodos,
      );
    },
    ...restConfig,
    mutationFn: deleteTodo,
  });
};
