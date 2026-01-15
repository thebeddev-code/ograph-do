"use client";
import { addHours, formatDate, set } from "date-fns";
import React, { useEffect, useRef, useState } from "react";

import { DEGREES_PER_HOUR } from "@/lib/utils/constants";
import { Todo } from "@/types/api";

import { calcClosestDistToClockHandle } from "../../utils/distToClockHandle";
import { drawTodos, todosToDrawables } from "../../utils/drawTodos";
import {
  calcDegreesFrom,
  getCurrentTimeInDegrees,
  snapToStep,
} from "../../utils/math";

import { Clock } from "./Clock";
import { ClockHandle } from "./ClockHandle";
import { degreesToDate } from "../../utils/date";
import { ChevronUp } from "lucide-react";

const RADIUS = 170;
const MAX_LAST_CLICK_DIFF_MS = 300;
const VIEW_HOURS = 6;
// once it's reached we can set the date to next
const MAX_TOTAL_DEGREES = 360 * 2;

interface Props {
  todos: Todo[];
  onFormOpen?: (data: Pick<Todo, "startsAt" | "due" | "color">) => void;
  onMoveDate?: (days: number) => void;
  currentDate?: Date;
}

export function ClockGraph({
  todos,
  onFormOpen,
  onMoveDate,
  currentDate,
}: Props) {
  const currentTimeInDegrees = getCurrentTimeInDegrees(currentDate);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const lastClickTimeRef = useRef(0);
  const [clockHandleDegrees, setClockHandleDegrees] = useState({
    currentAngle: currentTimeInDegrees % 360,
    totalAngle: currentTimeInDegrees,
  });
  const [createTodoDegrees, setCreateTodoDegrees] = useState<{
    start: null | number;
    end: null | number;
  }>({
    start: null,
    end: null,
  });

  let newTodo: Pick<Todo, "startsAt" | "due" | "color"> | null = null;
  if (
    typeof createTodoDegrees.start === "number" &&
    typeof createTodoDegrees.end === "number"
  ) {
    newTodo = {
      startsAt: degreesToDate(createTodoDegrees.start).toString(),
      due: degreesToDate(createTodoDegrees.end).toString(),
      color: "#000000",
    };
  }

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

    const viewHoursStart = clockHandleDegrees.totalAngle / DEGREES_PER_HOUR;
    const copyTodos = [...todos];
    if (newTodo) copyTodos.push(newTodo as Todo);
    const drawableTodos = todosToDrawables({ todos: copyTodos });
    drawTodos({
      canvas,
      drawableTodos: drawableTodos,
      radius: RADIUS,
      viewHours: {
        start: viewHoursStart - VIEW_HOURS,
        end: viewHoursStart + VIEW_HOURS,
      },
    });
  }, [todos, clockHandleDegrees, newTodo]);

  function handleMoveDateClick(days: number) {
    const isMoveForward = days > 0;
    if (isMoveForward) {
      setClockHandleDegrees({
        currentAngle: 0,
        totalAngle: 0,
      });
      onMoveDate?.(1);
    }
    if (!isMoveForward) {
      setClockHandleDegrees({
        currentAngle: MAX_TOTAL_DEGREES % 360,
        totalAngle: MAX_TOTAL_DEGREES,
      });
      onMoveDate?.(-1);
    }
  }

  function handleCreateTodoClick(e: React.MouseEvent<HTMLDivElement>) {
    // On the second double click we open the form and pass down the data
    if (
      typeof createTodoDegrees.start === "number" &&
      typeof createTodoDegrees.end === "number" &&
      newTodo
    ) {
      const hours = createTodoDegrees.end / DEGREES_PER_HOUR;
      const step = 15 / 60;
      onFormOpen?.({
        ...newTodo,
        startsAt: new Date(newTodo.startsAt as string).toISOString(),
        due: degreesToDate(
          calcDegreesFrom(snapToStep(hours, step), "hours"),
        ).toISOString(),
      });
      setCreateTodoDegrees({ start: null, end: null });
      return;
    }

    const lastClickTime = lastClickTimeRef.current;
    const currentClickTime = new Date().getTime();
    if (currentClickTime - lastClickTime < MAX_LAST_CLICK_DIFF_MS) {
      const offset = calcClosestDistToClockHandle({
        clickEvent: e,
        clockHandleDegrees: clockHandleDegrees.totalAngle,
      });
      const hours = (clockHandleDegrees.totalAngle + offset) / DEGREES_PER_HOUR;
      const step = 15 / 60; // 15 minutes
      setCreateTodoDegrees({
        start: calcDegreesFrom(snapToStep(hours, step), "hours"),
        end: null,
      });
    }
    lastClickTimeRef.current = currentClickTime;
  }

  const shouldTrackNewTodo = typeof createTodoDegrees.start === "number";
  const clock = (
    <>
      <div className="flex flex-row items-center gap-4  absolute -top-12 left-1/2 -translate-x-1/2">
        <button
          onClick={() => handleMoveDateClick(-1)}
          className="text-center h-5 w-5 rounded-full bg-muted text-xs font-medium text-muted-foreground select-none"
        >
          <ChevronUp className="-rotate-90" size={16} />
        </button>
        <div className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground select-none">
          {formatDate(currentDate ?? new Date(), "PP")}
        </div>
        <button
          onClick={() => handleMoveDateClick(1)}
          className="text-center h-5 w-5 rounded-full bg-muted text-xs font-medium text-muted-foreground select-none"
        >
          <ChevronUp className="rotate-90" size={16} />
        </button>
      </div>
      <Clock canvasRef={canvasRef} />
    </>
  );

  return (
    <div className="bg-white flex-col flex justify-center items-center">
      <div className="rounded-full" onClick={handleCreateTodoClick}>
        <ClockHandle
          value={clockHandleDegrees}
          onChange={(delta) => {
            const { totalAngle } = clockHandleDegrees;
            const newTotalAngle = totalAngle + delta;
            // Move to the next day
            if (newTotalAngle > MAX_TOTAL_DEGREES) {
              handleMoveDateClick(1);
              return;
            }
            // Move to the previous day
            if (newTotalAngle < 0) {
              handleMoveDateClick(-1);
              return;
            }
            setClockHandleDegrees(({ currentAngle, totalAngle }) => ({
              currentAngle: (currentAngle + delta) % 360,
              totalAngle: totalAngle + delta,
            }));
          }}
          resetValue={(v) => setClockHandleDegrees(v)}
          clockGraphRadius={RADIUS}
        >
          {shouldTrackNewTodo && (
            <ClockHandle
              value={{
                currentAngle:
                  createTodoDegrees.end ?? (createTodoDegrees.start as number),
                totalAngle: createTodoDegrees.end ?? 0,
              }}
              clockGraphRadius={RADIUS}
              onChange={(delta) => {
                if (!createTodoDegrees.start) return;
                const totalAngle =
                  (createTodoDegrees.end ?? createTodoDegrees.start) + delta;
                if (totalAngle < createTodoDegrees.start) return;

                setCreateTodoDegrees(({ start }) => ({
                  start,
                  end: totalAngle,
                }));
              }}
              followMouse={shouldTrackNewTodo}
              variant="minimal"
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
