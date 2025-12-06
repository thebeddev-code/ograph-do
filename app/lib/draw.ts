import { DEGREES_PER_HOUR, TIME_WINDOW_VISIBLE_HOURS } from "./utils/constants";
import { calcDegreesFrom, calcRadiansFrom } from "./utils/math";

interface DrawTodos {
  canvas: HTMLCanvasElement;
  days: Days;
  x?: number;
  y?: number;
  radius?: number;
  viewableTimeWindowDegrees: number;
}
export function drawTodos({
  canvas,
  days,
  x,
  y,
  radius,
  viewableTimeWindowDegrees,
}: DrawTodos) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const rect = canvas.getBoundingClientRect();

  function drawTodo(
    drawRadiansStart: number,
    drawRadiansEnd: number,
    offset: number,
    color: string
  ) {
    if (!ctx) return;
    ctx.beginPath();
    ctx.arc(
      x ?? rect.width / 2,
      y ?? rect.height / 2,
      radius ?? 200,
      drawRadiansStart - offset,
      drawRadiansEnd - offset
    );
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 10;
    ctx.stroke();
  }

  const offsetRadians = calcRadiansFrom(90);

  const visibleTimeWindowStart =
    (viewableTimeWindowDegrees + 90) / DEGREES_PER_HOUR;
  const visibleTimeWindowEnd =
    visibleTimeWindowStart + TIME_WINDOW_VISIBLE_HOURS;

  for (const day of days) {
    for (const todo of day) {
      const { start, end } = todo;

      const todoStartTime = start.hour + start.minutes / 60;
      const todoEndTime = end.hour + end.minutes / 60;

      const drawDegreesStart = calcDegreesFrom(
        Math.max(todoStartTime, visibleTimeWindowStart),
        "hours"
      );
      const drawDegreesEnd = calcDegreesFrom(
        Math.min(todoEndTime, visibleTimeWindowEnd),
        "hours"
      );

      const drawRadiansStart = calcRadiansFrom(drawDegreesStart);
      const drawRadiansEnd = calcRadiansFrom(drawDegreesEnd);
      console.log(
        todoStartTime,
        todoEndTime,
        visibleTimeWindowStart,
        visibleTimeWindowEnd
      );
      if (
        visibleTimeWindowStart <= todoEndTime &&
        visibleTimeWindowEnd >= todoStartTime
      )
        drawTodo(drawRadiansStart, drawRadiansEnd, offsetRadians, todo.color);
    }
  }
}
