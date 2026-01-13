import { addSeconds, formatDate } from "date-fns";
import { HTMLAttributes, useEffect, useState } from "react";

interface Props extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  dateFormatting?: string;
}
export function Time({ dateFormatting = "p", ...props }: Props) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setTime((prev) => addSeconds(prev, 1));
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [time]);

  return <div {...props}>{formatDate(time, dateFormatting)}</div>;
}
