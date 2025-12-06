"use client";
import { useEffect, useRef, useState } from "react";
import { mockDays } from "~/lib/utils/mockData";
import { drawTodos } from "~/lib/draw";
import { TimeViewAdjuster } from "~/components/TimeViewAdjuster";
import { calcRadiansFrom } from "../lib/utils/math";
import { Clock } from "./Clock";

export function ClockGraph() {
  const [timeWindowStartDeg, setTimeWindowStartDeg] = useState(90);
  const [timeWindowStartDegOffset, setTimeWindowStartDegOffset] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const radius = 150;

  if (timeWindowStartDeg >= 180 && timeWindowStartDegOffset < 180)
    setTimeWindowStartDegOffset(180);

  useEffect(() => {
    const canvas = canvasRef.current;
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

    // Day
    ctx.beginPath();
    ctx.moveTo(rect.width / 2, rect.height / 2);
    ctx.arc(
      rect.width / 2,
      rect.height / 2,
      radius,
      calcRadiansFrom(0),
      calcRadiansFrom(360),
      false
    );
    ctx.lineTo(rect.width / 2, rect.height / 2);
    ctx.fillStyle = "oklch(100% 0.12 90)";
    ctx.fill();

    // Draw circle
    ctx.beginPath();
    ctx.moveTo(rect.width / 2, rect.height / 2);
    ctx.arc(
      rect.width / 2,
      rect.height / 2,
      radius,
      calcRadiansFrom(90),
      calcRadiansFrom(timeWindowStartDeg),
      false
    );
    ctx.lineTo(rect.width / 2, rect.height / 2);
    ctx.fillStyle = "#E6E6FA";
    ctx.fill();

    drawTodos({
      canvas,
      days: mockDays,
      viewableTimeWindowDegrees: timeWindowStartDeg + timeWindowStartDegOffset,
      radius,
    });
  }, [timeWindowStartDeg]);

  return (
    <div className="bg-white flex justify-center items-center h-dvh w-dvw">
      <TimeViewAdjuster
        clockGraphRadius={radius}
        onViewableTimeDegreesChange={(d) => setTimeWindowStartDeg(d)}
        viewableTimeDegrees={timeWindowStartDeg}
      >
        <Clock canvasRef={canvasRef} />
      </TimeViewAdjuster>
    </div>
  );
}
