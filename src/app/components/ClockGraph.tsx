"use client";
import { useEffect, useRef, useState } from "react";
import { mockDays } from "~/lib/utils/mockData";
import { drawTodos } from "~/lib/draw";
import { TimeViewAdjuster } from "~/app/components/TimeViewAdjuster";
import { calcRadiansFrom } from "../../lib/utils/math";
import { Clock } from "./Clock";
import {
  DEGREES_PER_HOUR,
  TIME_WINDOW_VISIBLE_HOURS,
} from "~/lib/utils/constants";
import { LineGraph } from "./LineGraph";

export function ClockGraph() {
  const [timeWindowStartDeg, setTimeWindowStartDeg] = useState(0);
  const [timeWindowStartDegOffset, setTimeWindowStartDegOffset] = useState(0);
  const [fullRotationCount, setFullRotationCount] = useState(0);
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
      calcRadiansFrom(90 + timeWindowStartDeg),
      false
    );
    ctx.lineTo(rect.width / 2, rect.height / 2);
    ctx.fillStyle = "#E6E6FA";
    ctx.fill();

    const visibleTimeWindowStart =
      (timeWindowStartDeg + 180) / DEGREES_PER_HOUR;
    const visibleTimeWindowEnd =
      visibleTimeWindowStart + TIME_WINDOW_VISIBLE_HOURS;
    const arr = mockDays[fullRotationCount + 1];
    drawTodos({
      canvas,
      todos: mockDays[fullRotationCount + 1],
      viewableTimeWindow: {
        start: visibleTimeWindowStart,
        end: visibleTimeWindowEnd,
      },
      radius,
    });
    if (timeWindowStartDeg + 5 >= 360) {
      setTimeWindowStartDeg(0);
      setTimeWindowStartDegOffset(0);
      const nextFullRotationCount = fullRotationCount + 1;
      if (nextFullRotationCount < mockDays.length - 1)
        setFullRotationCount(fullRotationCount + 1);
    }
  }, [timeWindowStartDeg]);

  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  const result = `${formattedDate}`;

  return (
    <div className="bg-white flex-col flex justify-center items-center h-dvh w-dvw">
      <h1 className="text-2xl font-black mb-10">Day: {result}</h1>
      <TimeViewAdjuster
        clockGraphRadius={radius}
        onViewableTimeDegreesChange={(d) => setTimeWindowStartDeg(d)}
        viewableTimeDegrees={timeWindowStartDeg}
      >
        <Clock canvasRef={canvasRef} />
      </TimeViewAdjuster>
      <LineGraph
        todos={mockDays[1]}
        visibleTimeWindowStart={(timeWindowStartDeg + 180) / DEGREES_PER_HOUR}
      />
    </div>
  );
}
