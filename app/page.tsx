"use client";
import { useEffect, useRef, useState } from "react";
import { calcRadiansFrom } from "./lib/utils/math";
import { mockDays } from "./lib/utils/mockData";

export default function Home() {
  const [viewerString, setViewerString] = useState("6:00");
  const cancasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const [n, n1] = viewerString.split(":");
    const parsedN = parseInt(n);
    const parsedN1 = parseInt(n1);

    const canvas = cancasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    // Set internal resolution
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    // Scale drawing context
    ctx.scale(dpr, dpr);

    // Draw circle
    ctx.beginPath();
    ctx.arc(rect.width / 2, rect.height / 2, 200, 0, 2 * Math.PI);
    ctx.rect(rect.width / 2 - 200, rect.height / 2, 200 * 2, 1);
    ctx.rect(rect.width / 2, rect.height / 2 - 200, 1, 200 * 2);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    ctx.stroke();

    if (Number.isInteger(parsedN) && Number.isInteger(parsedN1)) {
      for (const day of mockDays) {
        for (const todo of day) {
          const { start, end } = todo;
          const offset = calcRadiansFrom(90);

          ctx.beginPath();
          ctx.arc(
            rect.width / 2,
            rect.height / 2,
            200,
            calcRadiansFrom(start.hour + start.minutes / 60, "hours") - offset,
            calcRadiansFrom(end.hour + end.minutes / 60, "hours") - offset
          );
          ctx.strokeStyle = todo.color;
          ctx.lineWidth = 10;
          ctx.stroke();
        }
      }
    }
  }, [viewerString]);

  return (
    <main className="bg-white flex">
      <canvas className="w-dvw h-dvh" ref={cancasRef}></canvas>
      <input
        className="bg-white w-20 h-10 absolute bottom-0 left-[45%]"
        type="text"
        value={viewerString}
        onChange={(e) => setViewerString(e.currentTarget.value)}
      />
    </main>
  );
}
