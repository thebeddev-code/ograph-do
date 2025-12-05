"use client";
import { useEffect, useRef, useState } from "react";
import { mockDays } from "~/lib/utils/mockData";
import { drawTodos } from "~/lib/draw";
import { TimeViewAdjuster } from "~/components/TimeViewAdjuster";

export function ClockGraph() {
  const [viewableTimeDegreesStart, setViewableTimeDegreesStart] = useState(90);
  const cancasRef = useRef<HTMLCanvasElement | null>(null);
  const radius = 150;

  useEffect(() => {
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
    const diameter = radius * 2;
    ctx.arc(rect.width / 2, rect.height / 2, radius, 0, 2 * Math.PI);
    ctx.rect(rect.width / 2 - radius, rect.height / 2, diameter, 1);
    ctx.rect(rect.width / 2, rect.height / 2 - radius, 1, diameter);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    ctx.stroke();

    drawTodos({
      canvas,
      days: mockDays,
      viewableTimeDegreesStart,
      radius,
    });
  }, [viewableTimeDegreesStart]);

  return (
    <div className="bg-white flex justify-center items-center h-dvh w-dvw">
      <TimeViewAdjuster
        clockGraphRadius={radius}
        containerClassName="w-[400px] h-[400px]"
        onViewableTimeDegreesChange={(d) => setViewableTimeDegreesStart(d)}
        viewableTimeDegrees={viewableTimeDegreesStart}
      >
        <canvas className="w-full h-full bg-amber-300" ref={cancasRef} />
      </TimeViewAdjuster>
    </div>
  );
}
