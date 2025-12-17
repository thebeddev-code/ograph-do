import * as React from "react";
import { type UseFormRegisterReturn } from "react-hook-form";
import { mergeClasses } from "~/lib/utils/strings";
import { FieldWrapper, FieldWrapperPassThroughProps } from "./FieldWrapper";

interface Props
  extends React.InputHTMLAttributes<HTMLInputElement>,
    FieldWrapperPassThroughProps {
  className?: string;
  registration: Partial<UseFormRegisterReturn>;
  ref?: React.Ref<HTMLInputElement>;
}

export function Input({
  className,
  type,
  label,
  error,
  registration,
  ref,
  ...props
}: Props) {
  return (
    <FieldWrapper label={label} error={error}>
      <input
        type={type}
        className={mergeClasses(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...registration}
        {...props}
      />
    </FieldWrapper>
  );
}

Input.displayName = "Input";
