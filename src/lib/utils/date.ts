export function formatDueDate(dueDate?: string): string {
  if (!dueDate) return "";
  const today = new Date();
  const dueDateObj = new Date(dueDate);
  const oneDay = 24 * 60 * 60 * 1000;

  const diffDays = (dueDateObj.getTime() - today.getTime()) / oneDay;

  if (diffDays < 0) return "Overdue";
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";

  const weekDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const dueDay = weekDays[dueDateObj.getDay()];

  const currentWeek =
    today.getFullYear() === dueDateObj.getFullYear() &&
    today.getMonth() === dueDateObj.getMonth() &&
    Math.ceil((today.getDate() + 1) / 7) ===
      Math.ceil((dueDateObj.getDate() + 1) / 7);

  return currentWeek
    ? dueDay
    : dueDateObj.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
      });
}

export function formatTimeToDoubleDigits(t = 0): string {
  return `${t < 9 ? 0 : ""}${t}`;
}

/**
 * Formats a given date into a string based on the specified format.
 *
 * @param {Date} [date=new Date()] - The date to format. Defaults to the current date and time if not provided.
 * @param {string} [format="yyyy-MM-dd"] - The format string that defines the output format.
 * The format can contain the following placeholders:
 *  - `yyyy`: full year (e.g., 2025)
 *  - `MM`: month (01-12)
 *  - `dd`: day of the month (01-31)
 *  - `HH`: hours in 24-hour format (00-23)
 *  - `mm`: minutes (00-59)
 *  - `ss`: seconds (00-59)
 *
 * @returns {string} The formatted date string based on the provided format.
 *
 * @example
 * // Returns "2025-12-19" if the date is December 19, 2025
 * formatDate(new Date("2025-12-19"), "yyyy-MM-dd");
 *
 * @example
 * // Returns "19-12-2025 14:30" if the date is December 19, 2025, 14:30
 * formatDate(new Date("2025-12-19T14:30:00"), "dd-MM-yyyy HH:mm");
 */
export function formatDate(
  date: Date = new Date(),
  format: string = "yyyy-MM-dd"
): string {
  const parts = {
    yyyy: String(date.getFullYear()),
    MM: formatTimeToDoubleDigits(date.getMonth() + 1),
    dd: formatTimeToDoubleDigits(date.getDate()),
    HH: formatTimeToDoubleDigits(date.getHours()),
    mm: formatTimeToDoubleDigits(date.getMinutes()),
    ss: formatTimeToDoubleDigits(date.getSeconds()),
  } as const;

  return format.replace(
    /yyyy|MM|dd|HH|mm|ss/g,
    (match) => parts[match as keyof typeof parts]
  );
}
