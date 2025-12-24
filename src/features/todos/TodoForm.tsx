'use client';
import { Todo } from '@/lib/types';
import { Form, Input, Textarea, Select } from '@/components/ui/form';
import { todoSchema } from '@/lib/schemas/todo.schema';

interface Props {
  todo?: Todo;
  formType: 'update' | 'create' | 'read-only';
}

export default function TodoForm({ todo }: Props) {
  return (
    <Form
      onSubmit={async (values: unknown) => {
        return alert(JSON.stringify(values, null, 2));
      }}
      schema={todoSchema}
      id="todo-form"
      options={{
        defaultValues: todo,
      }}
    >
      {({ register, formState }) => (
        <>
          <Input
            label="Title"
            error={formState.errors['title']}
            registration={register('title')}
          />
          <Textarea
            label="Description"
            error={formState.errors['description']}
            registration={register('description')}
          />
          <Select
            label="Type"
            error={formState.errors['type']}
            registration={register('type')}
            options={['A', 'B', 'C'].map((type) => ({
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
