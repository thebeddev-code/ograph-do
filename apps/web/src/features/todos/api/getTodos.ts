import { queryOptions, useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import { QueryConfig } from "@/lib/react-query";
import { Todo, Meta } from "@/types/api";

interface Params {
  page?: number;
  pageSize?: number;
  asc?: string;
  desc?: string;
  due?: "today" | "tommorow" | string;
}

export const getTodos = (
  params: Params,
): Promise<{
  data: Todo[];
  meta: Meta;
}> => {
  return api.get(`/todos`, {
    params: params as Record<string, string>,
  });
};

export const getTodosQueryOptions = (params: Params = {}) => {
  return queryOptions({
    queryKey: ["todos", params],
    queryFn: () => getTodos(params),
  });
};

interface UseTodosOptions {
  queryConfig?: QueryConfig<typeof getTodosQueryOptions>;
  params?: Params;
}

export const useTodos = ({ queryConfig, params }: UseTodosOptions) => {
  return useQuery({
    ...getTodosQueryOptions(params),
    ...queryConfig,
  });
};
