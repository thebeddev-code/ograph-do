"use client";
import { useEffect, useRef, useState } from "react";
import { drawTodos } from "./utils/drawTodos";
import { ClockHandle } from "./components/ClockHandle";
import { calcDegreesFrom, calcRadiansFrom } from "../../lib/utils/math";
import { Clock } from "./components/Clock";
import { DEGREES_PER_HOUR } from "@/lib/utils/constants";
import { Todo } from "@/types/api";

const RADIUS = 130;
interface Props {
  todos: Todo[];
}
export function ClockGraph({ todos }: Props) {
  const today = new Date();
  const currentTime = {
    hours: today.getHours(),
    minutes: today.getMinutes(),
  };
  const startAngle =
    calcDegreesFrom(currentTime.hours, "hours") +
    calcDegreesFrom(currentTime.minutes / 60, "hours");

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [clockHandleDegrees, setClockHandleDegrees] = useState(startAngle);

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
    ctx.scale(dpr, dpr);

    const viewHoursStart = (clockHandleDegrees / DEGREES_PER_HOUR) % 24;
    drawTodos({
      canvas,
      todos,
      radius: RADIUS,
      viewHours: {
        start: Math.max(viewHoursStart - 6, 0),
        end: Math.min(24, viewHoursStart + 6),
      },
    });
  }, [todos, clockHandleDegrees]);

  return (
    <div className="bg-white flex-col flex justify-center items-center">
      <ClockHandle
        startAngle={startAngle}
        clockGraphRadius={RADIUS}
        onChange={({ totalAngle }) => {
          setClockHandleDegrees(totalAngle);
        }}
      >
        <Clock canvasRef={canvasRef} />
      </ClockHandle>
    </div>
  );
}
