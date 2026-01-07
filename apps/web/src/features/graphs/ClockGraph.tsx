"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { drawTodos } from "./utils/drawTodos";
import { ClockHandle } from "./components/ClockHandle";
import { calcDegreesFrom } from "../../lib/utils/math";
import { Clock } from "./components/Clock";
import { DEGREES_PER_HOUR } from "@/lib/utils/constants";
import { Todo } from "@/types/api";
import { addHours, formatDate, set } from "date-fns";
import { DrawableTodo } from "@/lib/types";

const RADIUS = 170;
const MAX_LAST_CLICK_DIFF_MS = 300;
interface Props {
  drawableTodos: DrawableTodo[];
  onFormOpen?: (data: DrawableTodo) => void;
}
export function ClockGraph({ drawableTodos, onFormOpen }: Props) {
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
  const [newTodoDegrees, setNewTodoDegrees] = useState<{
    start: null | number;
    end: null | number;
  }>({
    start: null,
    end: null,
  });

  let drawableTodo = null;
  if (
    typeof newTodoDegrees.start === "number" &&
    typeof newTodoDegrees.end === "number"
  ) {
    drawableTodo = {
      startsAt: addHours(
        set(new Date(), { hours: 0, minutes: 0, seconds: 0 }),
        (newTodoDegrees.start + 360) / DEGREES_PER_HOUR,
      ).toString(),
      due: addHours(
        set(new Date(), { hours: 0, minutes: 0, seconds: 0 }),
        (newTodoDegrees.end + 360) / DEGREES_PER_HOUR,
      ).toString(),
      color: "black",
    };
  }

  const lastClickTimeRef = useRef(0);

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
    const copyTodos = [...drawableTodos];
    if (drawableTodo) copyTodos.push(drawableTodo as Todo);
    drawTodos({
      canvas,
      todos: copyTodos,
      radius: RADIUS,
      viewHours: {
        start: Math.max(viewHoursStart - 6, 0),
        end: Math.min(24, viewHoursStart + 6),
      },
    });
  }, [drawableTodos, clockHandleDegrees, drawableTodo]);

  const shouldTrackNewTodo = typeof newTodoDegrees.start === "number";
  const clock = (
    <>
      <div className="absolute -top-12 left-1/2 -translate-x-1/2">
        <div className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground select-none">
          {formatDate(new Date(), "PP")}
        </div>
      </div>
      <Clock canvasRef={canvasRef} />
    </>
  );

  return (
    <div className="bg-white flex-col flex justify-center items-center">
      <div
        className="rounded-full"
        onClick={(e) => {
          if (typeof newTodoDegrees.start === "number" && drawableTodo) {
            setNewTodoDegrees({ start: null, end: null });
            onFormOpen?.(drawableTodo);
            return;
          }
          const lastClickTime = lastClickTimeRef.current;
          const currentClickTime = new Date().getTime();
          if (currentClickTime - lastClickTime < MAX_LAST_CLICK_DIFF_MS) {
            const rect = e.currentTarget.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const dx = e.clientX - centerX;
            const dy = e.clientY - centerY;
            const angleRadians = Math.atan2(dx, -dy);
            let raw = calcDegreesFrom(angleRadians, "radians");
            if (raw < 0) raw += 360;
            setNewTodoDegrees({
              start: raw,
              end: null,
            });
          }
          lastClickTimeRef.current = currentClickTime;
        }}
      >
        <ClockHandle
          startAngle={startAngle}
          clockGraphRadius={RADIUS}
          onChange={({ totalAngle }) => {
            setClockHandleDegrees(totalAngle);
          }}
        >
          {shouldTrackNewTodo && (
            <ClockHandle
              startAngle={newTodoDegrees.start ?? 0}
              clockGraphRadius={RADIUS}
              onChange={({ totalAngle }) => {
                setNewTodoDegrees(({ start }) => ({
                  start,
                  end: totalAngle,
                }));
              }}
              followMouse={shouldTrackNewTodo}
              variant="minimal"
              snapDegrees={DEGREES_PER_HOUR * (1 / 60) * 5}
            >
              {clock}
            </ClockHandle>
          )}
          {!shouldTrackNewTodo && clock}
        </ClockHandle>
      </div>
    </div>
  );
}
