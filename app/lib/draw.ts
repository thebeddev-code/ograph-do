import { calcRadiansFrom } from "./utils/math";

interface DrawTodos {
  canvas: HTMLCanvasElement;
  days: Days;
  x?: number;
  y?: number;
  radius?: number;
  viewableStart: {
    hour: number;
    minutes: number;
  };
}
export function drawTodos({ canvas, days, x, y, radius }: DrawTodos) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const rect = canvas.getBoundingClientRect();

  for (const day of days) {
    for (const todo of day) {
      const { start, end } = todo;
      const offset = calcRadiansFrom(90);

      ctx.beginPath();
      ctx.arc(
        x ?? rect.width / 2,
        y ?? rect.height / 2,
        radius ?? 200,
        calcRadiansFrom(start.hour + start.minutes / 60, "hours") - offset,
        calcRadiansFrom(end.hour + end.minutes / 60, "hours") - offset
      );
      ctx.strokeStyle = todo.color;
      ctx.lineWidth = 10;
      ctx.stroke();
    }
  }
}
