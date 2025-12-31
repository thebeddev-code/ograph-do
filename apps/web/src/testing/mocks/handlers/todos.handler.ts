import { HttpResponse, http } from "msw";
import { env } from "@/config/env";
import { db, persistDb } from "../db";
import { networkDelay, requireAuth } from "../utils";
import { CreateTodoPayload } from "@/lib/schemas/todo.schema";
import { TodoModel, UserModel } from "../utils/models";
import { toZonedTime } from "date-fns-tz";
import { isSameDay } from "date-fns";

export const todosHandlers = [
  http.get(`${env.API_URL}/todos`, async ({ cookies, request }) => {
    await networkDelay();

    try {
      const { user, error } = requireAuth(cookies);
      if (error || !user) {
        return HttpResponse.json({ message: error }, { status: 401 });
      }
      const url = new URL(request.url);
      const page = Number(url.searchParams.get("page") || 1);
      const due = url.searchParams.get("due");

      const filters: Record<string, unknown> = {};
      if (due === "today") {
        filters.due = (d: string | undefined) => {
          if (!d) return false;
          const userTimezone = (user as UserModel).timezone;
          const nowInUserTz = toZonedTime(new Date(), userTimezone);
          const dueDateInUserTz = toZonedTime(d, userTimezone);
          return isSameDay(dueDateInUserTz, nowInUserTz);
        };
      }

      const result = db.todos.findMany((q) => q.where({ ...filters }), {
        take: 100,
      });
      const itemsTotal = db.todos.all();
      return HttpResponse.json({
        data: result,
        meta: {
          page,
          total: result.length,
          totalPages: Math.ceil(itemsTotal.length / 100),
        },
      });
    } catch (error: any) {
      return HttpResponse.json(
        { message: error?.message || "Server Error" },
        { status: 500 },
      );
    }
  }),

  http.get(`${env.API_URL}/todos/:todoId`, async ({ params, cookies }) => {
    await networkDelay();

    const { user, error } = requireAuth(cookies);
    if (error) {
      return HttpResponse.json({ message: error }, { status: 401 });
    }

    const todoId = Number(params.todoId) as number;
    const todo = db.todos.findFirst((q) =>
      q.where({
        id: todoId,
      }),
    );

    try {
      if (!todo) {
        return HttpResponse.json(
          { message: "Todo not found" },
          { status: 404 },
        );
      }

      return HttpResponse.json({
        data: {
          todo,
        },
      });
    } catch (error: any) {
      return HttpResponse.json(
        { message: error?.message || "Server Error" },
        { status: 500 },
      );
    }
  }),

  http.post(`${env.API_URL}/todos`, async ({ request, cookies }) => {
    await networkDelay();

    try {
      const { user, error } = requireAuth(cookies);
      if (error) {
        return HttpResponse.json({ message: error }, { status: 401 });
      }
      const data = (await request.json()) as CreateTodoPayload;
      const result = db.todos.createMany(1, (index) => ({
        id: index + 1,
        ...data,
      }));
      await persistDb("todos");
      return HttpResponse.json(result);
    } catch (error: any) {
      return HttpResponse.json(
        { message: error?.message || "Server Error" },
        { status: 500 },
      );
    }
  }),

  http.patch(
    `${env.API_URL}/todos/:todoId`,
    async ({ request, params, cookies }) => {
      await networkDelay();
      try {
        const { user, error } = requireAuth(cookies);
        if (error) {
          return HttpResponse.json({ message: error }, { status: 401 });
        }
        const data = (await request.json()) as Partial<TodoModel>;
        const todoId = Number(params.todoId) as number;
        const result = db.todos.update(
          (q) =>
            q.where({
              id: todoId,
            }),
          {
            data: (todo) => {
              const keys = Object.keys(data) as (keyof TodoModel)[];
              for (const key of keys) {
                (todo as any)[key] = data[key];
              }
            },
          },
        );
        await persistDb("todos");
        return HttpResponse.json(result);
      } catch (error: any) {
        return HttpResponse.json(
          { message: error?.message || "Server Error" },
          { status: 500 },
        );
      }
    },
  ),

  http.delete(`${env.API_URL}/todos/:todoId`, async ({ cookies, params }) => {
    await networkDelay();

    try {
      const { user, error } = requireAuth(cookies);
      if (error) {
        return HttpResponse.json({ message: error }, { status: 401 });
      }
      const todoId = Number(params.todoId) as number;
      const result = db.todos.delete((q) => q.where({ id: todoId }));
      await persistDb("todos");
      return HttpResponse.json(result);
    } catch (error: any) {
      return HttpResponse.json(
        { message: error?.message || "Server Error" },
        { status: 500 },
      );
    }
  }),
];
