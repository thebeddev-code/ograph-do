import * as React from "react";
import { type FieldError } from "react-hook-form";
import { Error } from "./Error";
import { Label } from "./Label";

type FieldWrapperProps = {
  label?: string;
  className?: string;
  children: React.ReactNode;
  error?: FieldError | any;
};

export type FieldWrapperPassThroughProps = Omit<
  FieldWrapperProps,
  "className" | "children"
>;

export function FieldWrapper({ label, error, children }: FieldWrapperProps) {
  return (
    <div>
      <Label>
        {label}
        <div className="mt-1">{children}</div>
      </Label>
      <Error errorMessage={error?.message} />
    </div>
  );
}
