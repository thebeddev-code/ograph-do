import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface Props {
  children: ReactNode;
  containerClassName?: string;
}
export function ViewableHandler({ children, containerClassName = "" }: Props) {
  return (
    <div
      className={twMerge(
        "relative flex justify-center items-center",
        containerClassName
      )}
    >
      {children}
    </div>
  );
}
