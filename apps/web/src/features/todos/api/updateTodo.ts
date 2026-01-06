import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import { MutationConfig } from "@/lib/react-query";

import { getTodosQueryOptions } from "./getTodos";
import { Todo } from "@/types/api";
import { CreateTodoPayload } from "@/lib/schemas/todo.schema";

export const updateTodo = (
  todoPayload: Partial<CreateTodoPayload> & { id: number },
) => {
  return api.patch(`/todos/${todoPayload.id}`, todoPayload);
};

type UseUpdateTodoOptions = {
  mutationConfig?: MutationConfig<typeof updateTodo>;
};

export const useUpdateTodo = ({ mutationConfig }: UseUpdateTodoOptions) => {
  const queryClient = useQueryClient();
  const { onSuccess, onError, ...restConfig } = mutationConfig || {};
  const queryKey = getTodosQueryOptions().queryKey;
  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey,
      });
      onSuccess?.(...args);
    },
    onMutate: async (todoPayload, context) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await context.client.cancelQueries({ queryKey });

      // Snapshot the previous value
      const previousTodos = context.client.getQueryData(queryKey);

      // Optimistically update to the new value
      if (Array.isArray(previousTodos) && previousTodos.length > 0) {
        context.client.setQueryData(queryKey, (cache) =>
          cache
            ? {
                data: previousTodos.map((t) => {
                  if (todoPayload.id === t.id)
                    return {
                      ...t,
                      todoPayload,
                    };
                  return t;
                }),
                meta: cache.meta,
              }
            : cache,
        );
      } else {
        context.client.setQueryData(queryKey, (cache) =>
          cache
            ? {
                data: [{ ...(todoPayload as Todo) }],
                meta: cache.meta,
              }
            : cache,
        );
      }
      // Return a result with the snapshotted value
      return { previousTodos };
    },
    // If the mutation fails,
    // use the result returned from onMutate to roll back
    onError: (...args) => {
      const [_, __, onMutateResult, context] = args;
      context.client.setQueryData(
        ["todos"],
        (onMutateResult as { previousTodos: Todo[] })?.previousTodos,
      );
      onError?.(...args);
    },
    ...restConfig,
    mutationFn: updateTodo,
  });
};
