import { cn } from "@/utils/cn";
import { useFormField } from "../form";

interface Props extends React.HTMLAttributes<HTMLParagraphElement> {
  ref?: React.Ref<HTMLParagraphElement>;
}
export function FormDescription({ className, ref, ...props }: Props) {
  const { formDescriptionId } = useFormField();

  return (
    <p
      ref={ref}
      id={formDescriptionId}
      className={cn("text-[0.8rem] text-muted-foreground", className)}
      {...props}
    />
  );
}
FormDescription.displayName = "FormDescription";
