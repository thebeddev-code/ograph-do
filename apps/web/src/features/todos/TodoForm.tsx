"use client";
import { Todo } from "@/types/api";
import {
  CreateTodoPayload,
  todoPayloadSchema,
} from "@/lib/schemas/todo.schema";
import { useForm, Resolver, FieldValues, Controller } from "react-hook-form";
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
import { HTMLAttributes, ReactNode, useMemo, useState } from "react";
import { FormProvider } from "react-hook-form";
import { TagsInputField } from "@/components/ui/tags-input";
import { ChevronDownIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format, formatDate, parse, set } from "date-fns";
import { useCreateTodo } from "./api/createTodo";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import { useUpdateTodo } from "./api/updateTodo";
import { TodoFormModes, TodoFormTodoData } from "./stores/todoForm.store";

const WEEKDAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

const DEFAULT_TAGS = [...WEEKDAYS, "everyday", "monthly", "weekly"];

interface Props {
  todoData?: TodoFormTodoData<TodoFormModes>;
  formMode: TodoFormModes;
  renderButtons?: () => ReactNode;
  onFormClose?: () => void;
  formProps?: HTMLAttributes<HTMLFormElement>;
}

export default function TodoForm({
  todoData = {},
  formMode,
  formProps,
  renderButtons,
  onFormClose,
}: Props) {
  const createTodoMutation = useCreateTodo({});
  const updateTodoMutation = useUpdateTodo({});

  const [openStartsAt, setOpenStartsAt] = useState(false);
  const [openDue, setOpenDue] = useState(false);
  const defaultValues = (
    formMode === "update"
      ? todoData
      : ({
          title: "",
          description: "",
          tags: [],
          isRecurring: false,
          priority: "low",
          color: "#00b4d8",
          monthly: new Date(),
          recurrenceRule: "",
          ...todoData,
        } as Partial<Todo> & { monthly?: Date })
  ) as Partial<Todo> & { monthly?: Date };
  if (formMode === "update") {
    if (defaultValues.recurrenceRule?.includes("monthly"))
      defaultValues.monthly = new Date(
        defaultValues.recurrenceRule.split("=").at(-1) as unknown as string,
      );
  }
  const form = useForm({
    resolver: zodResolver(
      todoPayloadSchema,
    ) as unknown as Resolver<FieldValues>,
    defaultValues,
    reValidateMode: "onBlur",
    mode: "onBlur",
  });
  const { handleSubmit, setValue, getValues, watch } = form;
  // Watch these fields
  // We use tags field to construct/set recurrence fields
  watch("tags");
  // This is to set interval of monthly recurrence rule
  watch("monthly");

  const currentTags = getValues("tags") || [];
  const currentMonthly = getValues("monthly");
  // Filter functional tag suggestions based on tags selected
  const tagSuggestions = useMemo(() => {
    // No suggestions if "everyday" or "monthly" is selected
    const lowerTags = currentTags.map((tag: string) => tag.toLowerCase());
    if (lowerTags.includes("everyday") || lowerTags.includes("monthly")) {
      return [];
    }

    // If weekly or specific weekdays selected, suggest only weekdays
    const lowercaseWeekdays = WEEKDAYS.map((w) => w.toLowerCase());
    const hasWeeklyOrWeekday =
      lowerTags.includes("weekly") ||
      lowerTags.some((tag: string) => lowercaseWeekdays.includes(tag));

    if (hasWeeklyOrWeekday) {
      return WEEKDAYS.filter((v) => !lowerTags.includes(v.toLowerCase()));
    }

    // Default: all options
    return DEFAULT_TAGS;
  }, [currentTags]);

  // Handle recurrence rule
  const currentRecurrenceRule = getValues("recurrenceRule");
  const currentIsRecurring = getValues("isRecurring");
  const strippedRRulePart =
    typeof currentRecurrenceRule === "string"
      ? currentRecurrenceRule.replace("rrule:", "")
      : "";
  if (strippedRRulePart && !currentIsRecurring) {
    setValue("isRecurring", true);
  }
  if (!strippedRRulePart && currentIsRecurring) {
    setValue("isRecurring", false);
  }

  const newRecurrenceRule = useMemo(() => {
    function getRecurrenceRule() {
      const lowerCaseTags: string[] = currentTags.map((v: string) =>
        v.toLowerCase(),
      );
      if (lowerCaseTags.includes("everyday")) return "everyday";
      const weekly = lowerCaseTags.filter((v) => WEEKDAYS.includes(v));
      if (weekly.length > 0) return `weekly=${weekly.join(",")}`;
      if (lowerCaseTags.includes("weekly"))
        return `weekly=${WEEKDAYS[new Date().getDay() - 1]}`;
      if (lowerCaseTags.includes("monthly")) {
        const monthlyDate = formatDate(
          currentMonthly ? new Date(currentMonthly) : new Date(),
          "yyyy-MM-dd",
        );
        return `monthly=${monthlyDate}`;
      }

      return "";
    }
    return `rrule:${getRecurrenceRule()}`.toLowerCase();
  }, [currentTags, currentMonthly]);

  if (newRecurrenceRule != currentRecurrenceRule)
    setValue("recurrenceRule", newRecurrenceRule);

  const showMonthlyField = getValues("tags")?.includes("monthly");
  const fieldIds: Record<keyof CreateTodoPayload, string> & {
    monthly: string;
  } = useMemo(
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
      // Temp form field
      monthly: uuidv4(),
    }),
    [],
  );

  const onSubmit = handleSubmit(async (data) => {
    if (formMode === "create")
      await toast.promise(
        createTodoMutation.mutateAsync(data as CreateTodoPayload),
        {
          loading: "Saving...",
          success: <b>Todo created!</b>,
          error: <b>Could not create todo.</b>,
        },
      );
    if (formMode === "update")
      await toast.promise(
        updateTodoMutation.mutateAsync({ id: todoData?.id as number, ...data }),
        {
          loading: "Saving...",
          success: <b>Todo updated!</b>,
          error: <b>Could not update todo.</b>,
        },
      );
    onFormClose?.();
  });

  return (
    <FormProvider {...form}>
      <form
        id="todo-form"
        className="px-4 py-14 flex flex-col gap-4"
        {...formProps}
        onSubmit={onSubmit}
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
                  maxLength={255}
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
                    maxLength={500}
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
        {/* Todo time */}
        <FieldGroup className="my-4">
          <div className="flex row gap-4">
            {/* Starts at */}
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
                                minutes: field.value
                                  ? dateValue.getMinutes()
                                  : 0,
                                seconds: field.value
                                  ? dateValue.getSeconds()
                                  : 0,
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
                      step={60}
                      value={format(
                        field.value
                          ? new Date(field.value)
                          : parse("10:30", "HH:mm", new Date()),
                        "HH:mm",
                      )}
                      onChange={(e) => {
                        field.onChange(
                          parse(
                            e.currentTarget.value,
                            "HH:mm",
                            field.value ? new Date(field.value) : new Date(),
                          ).toISOString(),
                        );

                        const dueDate = getValues("due");
                        setValue(
                          "due",
                          parse(
                            e.currentTarget.value,
                            "HH:mm",
                            dueDate ? new Date(dueDate) : new Date(),
                          ).toISOString(),
                        );
                      }}
                    />
                  </div>
                </Field>
              )}
            />

            {/* Due */}
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
                      step={60}
                      value={format(
                        field.value
                          ? new Date(field.value)
                          : parse("10:30", "HH:mm", new Date()),
                        "HH:mm",
                      )}
                      onChange={(e) => {
                        field.onChange(
                          parse(
                            e.currentTarget.value,
                            "HH:mm",
                            field.value ? new Date(field.value) : new Date(),
                          ).toISOString(),
                        );
                      }}
                    />
                  </div>
                </Field>
              )}
            />
          </div>

          {/* Priority && Color */}
          <div className="flex flex-row gap-4">
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
          </div>
        </FieldGroup>

        {/* Tags */}
        <FieldGroup
          className={cn({ "grid grid-cols-[1fr_auto]": showMonthlyField })}
        >
          <TagsInputField
            variant="default"
            name="tags"
            label="Tags"
            placeholder="Todo tags"
            tagVariant="outline"
            suggestions={tagSuggestions}
            maxLength={50}
          />
          {showMonthlyField && (
            <Controller
              name="monthly"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={fieldIds.startsAt}>
                    Monthly start
                  </FieldLabel>
                  <div className="flex flex-row gap-3">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          id="date-picker"
                          className="w-32 justify-between font-normal"
                        >
                          {(field.value ?? defaultValues?.monthly)
                            ? new Date(
                                field?.value ??
                                  (defaultValues?.monthly as unknown as string),
                              ).toLocaleDateString()
                            : "Select date"}
                          <ChevronDownIcon />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-auto overflow-hidden p-0"
                        align="start"
                      >
                        <Calendar
                          id={`${fieldIds.monthly}`}
                          mode="single"
                          selected={field.value}
                          captionLayout="dropdown"
                          onSelect={field.onChange}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </Field>
              )}
            />
          )}
        </FieldGroup>

        {renderButtons?.() ?? <Button>Submit</Button>}
      </form>
    </FormProvider>
  );
}
