export function formatDueDate(dueDate?: string) {
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

export function formatTimeToDoubleDigits(t = 0) {
  return t > 9 ? t : `0${t}`;
}
