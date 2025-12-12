import { calcDegreesFrom, calcRadiansFrom } from "./utils/math";
import { Todo } from "./types";

interface DrawTodos {
  canvas: HTMLCanvasElement;
  todos: Todo[];
  x?: number;
  y?: number;
  radius?: number;
  viewableTimeWindow: {
    start: number;
    end: number;
  };
}
export function drawTodos({
  canvas,
  todos,
  x,
  y,
  radius,
  viewableTimeWindow,
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

  for (const todo of todos) {
    if (!todo.time) continue;

    const { start, end } = todo.time;

    const todoStartTime = start.hour + start.minutes / 60;
    const todoEndTime = end.hour + end.minutes / 60;

    const drawDegreesStart = calcDegreesFrom(
      Math.max(todoStartTime, viewableTimeWindow.start),
      "hours"
    );
    const drawDegreesEnd = calcDegreesFrom(
      Math.min(todoEndTime, viewableTimeWindow.end),
      "hours"
    );

    const drawRadiansStart = calcRadiansFrom(drawDegreesStart);
    const drawRadiansEnd = calcRadiansFrom(drawDegreesEnd);
    if (
      viewableTimeWindow.start <= todoEndTime &&
      viewableTimeWindow.end >= todoStartTime
    )
      drawTodo(
        drawRadiansStart,
        drawRadiansEnd,
        offsetRadians,
        todo.color ?? "magenta"
      );
  }
}
