"use client";

import * as LabelPrimitive from "@radix-ui/react-label";
import * as React from "react";
import { mergeClasses } from "~/lib/utils/strings";

interface Props extends LabelPrimitive.LabelProps {
  className?: string;
  ref?: React.Ref<HTMLLabelElement>;
}
export function Label({ className, ref, ...props }: Props) {
  return (
    <LabelPrimitive.Root
      ref={ref}
      className={mergeClasses(
        "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className
      )}
      {...props}
    />
  );
}

Label.displayName = LabelPrimitive.Root.displayName;
