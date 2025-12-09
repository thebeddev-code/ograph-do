import { useEffect, useMemo, useRef } from "react";
import { drawTodos } from "../../lib/draw";

interface Props {
  todos: Todo[];
  visibleTimeWindowStart: number;
}
export function LineGraph({ todos, visibleTimeWindowStart }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;
    const unitWidth = width / 24;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, "#f0f4ff");
    gradient.addColorStop(1, "#d9e2ff");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Draw todos
    todos.forEach((t) => {
      const { start, end, color } = t;
      const startX = unitWidth * start.hour + (unitWidth * start.minutes) / 60;
      const endX = unitWidth * end.hour + (unitWidth * end.minutes) / 60;
      ctx.fillStyle = color;
      ctx.shadowColor = "rgba(0, 0, 0, 0.2)";
      ctx.shadowBlur = 4;
      ctx.fillRect(startX + 1, 4, endX - startX - 2, height - 8);
      ctx.shadowBlur = 0;
    });

    // Draw grid lines and labels
    ctx.strokeStyle = "#bbb";
    ctx.fillStyle = "#444";
    ctx.textBaseline = "top";

    for (let i = 0; i <= 24; i++) {
      const x = unitWidth * i + 0.5; // 0.5 for crisp lines
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();

      if (i < 24) {
        const label = i < 10 ? `0${i}:00` : `${i}:00`;
        ctx.fillText(label, x + 4, 4);
      }
    }
  }, [todos]);

  return (
    <div className="relative mt-10 border rounded-lg shadow-lg bg-white">
      <canvas
        ref={canvasRef}
        className="w-[1000px] h-24 rounded-lg"
        style={{ imageRendering: "pixelated" }}
      />
      <div
        style={{ left: `${(visibleTimeWindowStart / 24) * 100}%` }}
        className="absolute z-10 top-0 h-full w-[500px] border-2 border-purple-600 bg-purple-100/30 rounded pointer-events-none"
      />
    </div>
  );
}
