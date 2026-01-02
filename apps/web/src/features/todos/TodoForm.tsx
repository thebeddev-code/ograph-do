"use client";
import { Todo } from "@/types/api";
import {
  CreateTodoPayload,
  todoPayloadSchema,
} from "@/lib/schemas/todo.schema";
import {
  useForm,
  useFieldArray,
  Resolver,
  FieldValues,
  Controller,
} from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { v4 as uuidv4 } from "uuid";
import { SetStateAction, useId, useMemo, useState } from "react";
import { FormProvider } from "react-hook-form";
import { TagsInputField } from "@/components/ui/tags-input";
import { ChevronDownIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format, parse, set } from "date-fns";

interface Props {
  todo?: Todo;
  formType: "update" | "create" | "read-only";
}

export default function TodoForm({ todo, formType }: Props) {
  const [openStartsAt, setOpenStartsAt] = useState(false);
  const [openDue, setOpenDue] = useState(false);
  const form = useForm({
    resolver: zodResolver(
      todoPayloadSchema,
    ) as unknown as Resolver<FieldValues>,
    defaultValues: {
      title: "",
      description: "",
      tags: [],
      isRecurring: false,
      priority: "medium",
      color: "#000000",
    } as Partial<Todo>,
  });

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "tags",
  });
  const onSubmit = handleSubmit((data) => {
    console.log(JSON.stringify(data, null, 2));
  });
  const fieldIds: Record<keyof CreateTodoPayload, string> = useMemo(
    () => ({
      title: uuidv4(),
      color: uuidv4(),
      completedAt: uuidv4(),
      createdAt: uuidv4(),
      description: uuidv4(),
      due: uuidv4(),
      isRecurring: uuidv4(),
      priority: uuidv4(),
      recurrenceRule: uuidv4(),
      startsAt: uuidv4(),
      status: uuidv4(),
      tags: uuidv4(),
      updatedAt: uuidv4(),
    }),
    [],
  );
  return (
    <FormProvider {...form}>
      <form
        onSubmit={onSubmit}
        id="todo-form"
        className="px-4 py-14 flex flex-col gap-4"
      >
        {/* --- Title --- */}
        <FieldGroup>
          <Controller
            name="title"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={fieldIds.title}>Title</FieldLabel>
                <Input
                  {...field}
                  id={fieldIds.title}
                  aria-invalid={fieldState.invalid}
                  placeholder="What needs to be done?"
                  autoComplete="off"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/* --- Description --- */}
          <Controller
            name="description"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={fieldIds.description}>
                  Description
                </FieldLabel>
                <InputGroup>
                  <InputGroupTextarea
                    {...field}
                    id={fieldIds.description}
                    placeholder="First [ ] ... then [ ] ..."
                    rows={6}
                    className="min-h-24 resize-none"
                    aria-invalid={fieldState.invalid}
                  />
                  <InputGroupAddon align="block-end">
                    <InputGroupText className="">
                      {field?.value?.length ?? 0}/500 characters
                    </InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>

        {/* Tags */}
        <FieldGroup>
          <TagsInputField
            variant="enterprise"
            name="tags"
            label="Tags"
            placeholder="Todo tags"
          />
        </FieldGroup>

        <FieldGroup className="flex-row">
          {/* Color */}
          <Controller
            name="color"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={fieldIds.color}>Color</FieldLabel>
                <Input
                  id={fieldIds.color}
                  type="color"
                  aria-invalid={fieldState.invalid}
                  {...field}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          {/* Priority */}
          <Controller
            name="priority"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={fieldIds.priority}>Priority</FieldLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">
                      Low{" "}
                      <span className="ml-2 h-3 w-3 rounded-full bg-green-400 inline-block align-middle" />
                    </SelectItem>
                    <SelectItem value="medium">
                      Medium{" "}
                      <span className="ml-2 h-3 w-3 rounded-full bg-yellow-400 inline-block align-middle" />
                    </SelectItem>
                    <SelectItem value="high">
                      High{" "}
                      <span className="ml-2 h-3 w-3 rounded-full bg-red-400 inline-block align-middle" />
                    </SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            )}
          />
        </FieldGroup>
        <FieldGroup>
          <Controller
            name="startsAt"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={fieldIds.startsAt}>Starts at</FieldLabel>
                <div className="flex flex-row gap-3">
                  <Popover open={openStartsAt} onOpenChange={setOpenStartsAt}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        id="date-picker"
                        className="w-32 justify-between font-normal"
                      >
                        {field.value
                          ? new Date(field?.value).toLocaleDateString()
                          : "Select date"}
                        <ChevronDownIcon />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto overflow-hidden p-0"
                      align="start"
                    >
                      <Calendar
                        id={`${fieldIds.startsAt}-date`}
                        mode="single"
                        selected={field.value}
                        captionLayout="dropdown"
                        onSelect={(date) => {
                          if (date) {
                            const dateValue = new Date(field.value ?? "");
                            const startsAt = set(date, {
                              hours: field.value ? dateValue.getHours() : 0,
                              minutes: field.value ? dateValue.getMinutes() : 0,
                              seconds: field.value ? dateValue.getSeconds() : 0,
                            })?.toISOString();
                            field.onChange(startsAt);
                            setValue("due", startsAt);
                          }
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                  <Input
                    id={`${fieldIds.startsAt}-time`}
                    type="time"
                    step="1"
                    value={format(
                      field.value
                        ? new Date(field.value)
                        : parse("10:30:00", "HH:mm:ss", new Date()),
                      "HH:mm:ss",
                    )}
                    onChange={(e) => {
                      field.onChange(
                        parse(
                          e.currentTarget.value,
                          "HH:mm:ss",
                          field.value ? new Date(field.value) : new Date(),
                        ).toISOString(),
                      );
                    }}
                  />
                </div>
              </Field>
            )}
          />
          <Controller
            name="due"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={fieldIds.due}>Due</FieldLabel>
                <div className="flex flex-row gap-3">
                  <Popover open={openDue} onOpenChange={setOpenDue}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        id="date-picker"
                        className="w-32 justify-between font-normal"
                      >
                        {field.value
                          ? new Date(field?.value).toLocaleDateString()
                          : "Select date"}
                        <ChevronDownIcon />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto overflow-hidden p-0"
                      align="start"
                    >
                      <Calendar
                        id={`${fieldIds.due}-date`}
                        mode="single"
                        selected={field.value}
                        captionLayout="dropdown"
                        onSelect={(date) => {
                          if (date) {
                            const dateValue = new Date(field.value ?? "");
                            field.onChange(
                              set(date, {
                                hours: field.value ? dateValue.getHours() : 0,
                                minutes: field.value
                                  ? dateValue.getMinutes()
                                  : 0,
                                seconds: field.value
                                  ? dateValue.getSeconds()
                                  : 0,
                              })?.toISOString(),
                            );
                          }
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                  <Input
                    id={`${fieldIds.startsAt}-time`}
                    type="time"
                    step="1"
                    value={format(
                      field.value
                        ? new Date(field.value)
                        : parse("10:30:00", "HH:mm:ss", new Date()),
                      "HH:mm:ss",
                    )}
                    onChange={(e) => {
                      field.onChange(
                        parse(
                          e.currentTarget.value,
                          "HH:mm:ss",
                          field.value ? new Date(field.value) : new Date(),
                        ).toISOString(),
                      );
                    }}
                  />
                </div>
              </Field>
            )}
          />
        </FieldGroup>
        <Button>Submit</Button>
      </form>
    </FormProvider>
  );
}
