import { Slot } from "@radix-ui/react-slot";
import { useFormField } from "../form";

interface Props {
  ref?: React.Ref<HTMLElement>;
}

export function FormControl({ ref, ...props }: Props) {
  const { error, formItemId, formDescriptionId, formMessageId } =
    useFormField();

  return (
    <Slot
      ref={ref}
      id={formItemId}
      aria-describedby={
        !error
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
      {...props}
    />
  );
}

FormControl.displayName = "FormControl";
