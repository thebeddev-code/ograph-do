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
import { ZodType, z } from "zod";
import { mergeClasses } from "~/lib/utils/strings";

interface Props<TFormValues extends FieldValues, Schema> {
  onSubmitAction: SubmitHandler<TFormValues>;
  schema: Schema;
  className?: string;
  children: (methods: UseFormReturn<TFormValues>) => React.ReactNode;
  options?: UseFormProps<TFormValues>;
  id?: string;
}

export function Form<
  Schema extends ZodType<any, any, any>,
  TFormValues extends FieldValues = z.infer<Schema>
>({
  onSubmitAction,
  children,
  className,
  options,
  id,
  schema,
}: Props<TFormValues, Schema>) {
  const form = useForm({
    ...options,
    resolver: zodResolver(schema) as unknown as Resolver<TFormValues>,
  });
  return (
    <FormProvider {...form}>
      <form
        className={mergeClasses("space-y-6", className)}
        onSubmit={form.handleSubmit(onSubmitAction)}
        id={id}
      >
        {children(form)}
      </form>
    </FormProvider>
  );
}
