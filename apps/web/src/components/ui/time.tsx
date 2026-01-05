import { addSeconds, formatDate } from "date-fns";
import { Ref, useEffect, useState } from "react";

interface Props {
  className?: string;
  dateFormatting?: string;
}
export function Time({ dateFormatting = "p", className }: Props) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setTime((prev) => addSeconds(prev, 1));
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [time]);

  return <div className={className}>{formatDate(time, "p")}</div>;
}
