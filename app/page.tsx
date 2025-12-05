"use client";
import { useEffect, useRef, useState } from "react";
import { calcRadiansFrom } from "./lib/utils/math";
import { mockDays } from "./lib/utils/mockData";
import { drawTodos } from "./lib/draw";
import { mock } from "node:test";

export default function Home() {
  const [viewableString, setViewableString] = useState("6:00");
  const cancasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const [hours, minutes] = viewableString.split(":");
    const viewableStartHours = parseInt(hours);
    const viewableStartMinutes = parseInt(minutes);
    if (
      !(
        Number.isInteger(viewableStartHours) &&
        Number.isInteger(viewableStartMinutes)
      )
    )
      return;

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

    drawTodos({
      canvas,
      days: mockDays,
      viewableStart: {
        hour: viewableStartHours,
        minutes: viewableStartMinutes,
      },
    });
  }, [viewableString]);

  return (
    <main className="bg-white flex">
      <canvas className="w-dvw h-dvh" ref={cancasRef}></canvas>
      <input
        className="bg-white w-20 h-10 absolute bottom-0 left-[45%]"
        type="text"
        value={viewableString}
        onChange={(e) => setViewableString(e.currentTarget.value)}
      />
    </main>
  );
}
