import { cn } from "@/utils/cn";
import { useId } from "react";
import { FormItemContext } from "./formItemContext";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  ref?: React.Ref<HTMLDivElement>;
}
export function FormItem({ className, ref, ...props }: Props) {
  const id = useId();

  return (
    <FormItemContext.Provider value={{ id }}>
      <div ref={ref} className={cn("space-y-2", className)} {...props} />
    </FormItemContext.Provider>
  );
}
FormItem.displayName = "FormItem";
