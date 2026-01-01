import React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { Label } from "../Label";
import { cn } from "@/utils/cn";
import { useFormField } from "../form";

interface Props extends LabelPrimitive.LabelProps {
  ref?: React.Ref<HTMLLabelElement>;
}

export function FormLabel({ className, ref, ...props }: Props) {
  const { error, formItemId } = useFormField();
  return (
    <Label
      ref={ref}
      className={cn(error && "text-destructive", className)}
      htmlFor={formItemId}
      {...props}
    />
  );
}

FormLabel.displayName = "FormLabel";
