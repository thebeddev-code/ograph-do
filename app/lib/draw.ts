import { calcDegreesFrom, calcRadiansFrom } from "./utils/math";

interface DrawTodos {
  canvas: HTMLCanvasElement;
  days: Days;
  x?: number;
  y?: number;
  radius?: number;
  viewableTimeDegreesStart: number;
}
export function drawTodos({
  canvas,
  days,
  x,
  y,
  radius,
  viewableTimeDegreesStart,
}: DrawTodos) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const rect = canvas.getBoundingClientRect();

  function drawArc(
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
    ctx.lineWidth = 10;
    ctx.stroke();
  }
  const offsetRadians = calcRadiansFrom(90);
  const correctedViewableTimeDegreesStart = viewableTimeDegreesStart + 90;
  const viewableTimeDegreesEnd =
    correctedViewableTimeDegreesStart + calcDegreesFrom(12, "hours");

  for (const day of days) {
    for (const todo of day) {
      const { start, end } = todo;
      const drawDegreesStart = calcDegreesFrom(
        start.hour + start.minutes / 60,
        "hours"
      );
      const drawDegreesEnd = calcDegreesFrom(
        end.hour + end.minutes / 60,
        "hours"
      );

      const drawRadiansStart = calcRadiansFrom(
        Math.max(drawDegreesStart, correctedViewableTimeDegreesStart)
      );
      const drawRadiansEnd = calcRadiansFrom(
        Math.min(drawDegreesEnd, viewableTimeDegreesEnd)
      );
      if (correctedViewableTimeDegreesStart < drawDegreesEnd)
        drawArc(drawRadiansStart, drawRadiansEnd, offsetRadians, todo.color);
    }
  }
}
