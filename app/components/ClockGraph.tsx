"use client";
import { useEffect, useRef, useState } from "react";
import { mockDays } from "~/lib/utils/mockData";
import { drawTodos } from "~/lib/draw";
import { ViewableHandler } from "~/components/ViewableHandler";

export function ClockGraph() {
  const [viewableString, setViewableString] = useState("6:00");
  const cancasRef = useRef<HTMLCanvasElement | null>(null);
  const radius = 150;

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
      viewableStart: {
        hour: viewableStartHours,
        minutes: viewableStartMinutes,
      },
      radius,
    });
  }, [viewableString]);

  return (
    <div className="bg-white flex justify-center items-center h-dvh w-dvw">
      <ViewableHandler
        clockGraphRadius={radius}
        containerClassName="w-[400px] h-[400px]"
      >
        <canvas className="w-full h-full bg-amber-300" ref={cancasRef} />
      </ViewableHandler>
    </div>
  );
}
