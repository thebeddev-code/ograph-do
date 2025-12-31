"use client";
import { Todo } from "@/types/api";
import {
  Form,
  Input,
  Textarea,
  Select,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { todoPayloadSchema } from "@/lib/schemas/todo.schema";
import { Button } from "@/components/ui/button";

interface Props {
  todo?: Todo;
  formType: "update" | "create" | "read-only";
}

export default function TodoForm({ todo }: Props) {
  return (
    <Form
      onSubmit={async (values) => {
        alert(JSON.stringify(values, null, 2));
      }}
      schema={todoPayloadSchema}
      id="todo-form"
      options={{
        defaultValues: todo,
      }}
    >
      {(form) => (
        <>
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input registration={form.register("title")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    registration={form.register("description")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Priority</FormLabel>
                <FormControl>
                  <Select
                    registration={form.register("priority")}
                    {...field}
                    options={["low", "medium", "high"].map((priority) => ({
                      label: priority,
                      value: priority,
                    }))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="startsAt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Starts At</FormLabel>
                <FormControl>
                  <Input registration={form.register("startsAt")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="due"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Due</FormLabel>
                <FormControl>
                  <Input registration={form.register("due")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div>
            <Button type="submit" className="w-full">
              Submit
            </Button>
          </div>
        </>
      )}
    </Form>
  );
}
