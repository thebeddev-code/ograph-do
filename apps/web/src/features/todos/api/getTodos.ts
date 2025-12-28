import { queryOptions, useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import { QueryConfig } from "@/lib/react-query";
import { Todo, Meta } from "@/types/api";

export const getTodos = (
  { page }: { page?: number } = { page: 1 },
): Promise<{
  data: Todo[];
  meta: Meta;
}> => {
  return api.get(`/todos`, {
    params: {
      page,
    },
  });
};

export const getTodosQueryOptions = ({ page = 1 }: { page?: number } = {}) => {
  return queryOptions({
    queryKey: ["todos", { page }],
    queryFn: () => getTodos({ page }),
  });
};

interface UseTodosOptions {
  queryConfig?: QueryConfig<typeof getTodosQueryOptions>;
  page?: number;
}
export const useTodos = ({ queryConfig, page }: UseTodosOptions) => {
  return useQuery({
    ...getTodosQueryOptions({ page }),
    ...queryConfig,
  });
};
