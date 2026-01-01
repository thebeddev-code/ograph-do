"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as React from "react";
import {
  FieldValues,
  FormProvider,
  Resolver,
  SubmitHandler,
  UseFormProps,
  UseFormReturn,
  useForm,
} from "react-hook-form";
import { ZodObject, ZodRawShape, ZodType, z } from "zod";
import { cn } from "@/utils/cn";
import {
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
} from "./components";
import { useFormField } from "./hooks/useFormField";

interface FormProps<TFormValues extends FieldValues, Schema> {
  onSubmit: SubmitHandler<TFormValues>;
  schema: Schema;
  className?: string;
  children: (methods: UseFormReturn<TFormValues>) => React.ReactNode;
  options?: UseFormProps<TFormValues>;
  id?: string;
}

function Form<
  Schema extends ZodObject<ZodRawShape>,
  TFormValues extends FieldValues = z.infer<Schema>,
>({
  onSubmit,
  children,
  className,
  options,
  id,
  schema,
}: FormProps<TFormValues, Schema>) {
  const form = useForm({
    ...options,
    resolver: zodResolver(schema) as unknown as Resolver<TFormValues>,
  });
  return (
    <FormProvider {...form}>
      <form
        className={cn("space-y-6", className)}
        onSubmit={form.handleSubmit(onSubmit)}
        id={id}
      >
        {children(form)}
      </form>
    </FormProvider>
  );
}

export {
  useFormField,
  Form,
  FormProvider,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
};
