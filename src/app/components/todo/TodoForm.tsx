"use client";
import { Todo } from "~/lib/types";
import { Form, Input, Textarea, Select } from "~/components/ui/form";
import z from "zod";

interface Props {
  todo?: Todo;
  formType: "update" | "create" | "read-only";
}

export default function TodoForm({ todo, formType }: Props) {
  return (
    <Form
      onSubmitAction={async (values: any) => {
        return alert(JSON.stringify(values, null, 2));
      }}
      schema={z.object({
        title: z.string().min(1, "Required"),
        description: z.string().min(1, "Required"),
        type: z.string().min(1, "Required"),
      })}
      id="todo-form"
    >
      {({ register, formState }) => (
        <>
          <Input
            label="Title"
            error={formState.errors["title"]}
            registration={register("title")}
          />
          <Textarea
            label="Description"
            error={formState.errors["description"]}
            registration={register("description")}
          />
          <Select
            label="Type"
            error={formState.errors["type"]}
            registration={register("type")}
            options={["A", "B", "C"].map((type) => ({
              label: type,
              value: type,
            }))}
          />

          {/* {!hideSubmit && (
            <div>
              <Button type="submit" className="w-full">
                Submit
              </Button>
            </div>
          )} */}
        </>
      )}
    </Form>
  );
}
