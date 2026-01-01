"use client";

import * as React from "react";
import { useFormContext, FieldPath, FieldValues } from "react-hook-form";

type FormFieldContextModel<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName;
};

export const FormFieldContext = React.createContext<FormFieldContextModel>(
  {} as FormFieldContextModel,
);
