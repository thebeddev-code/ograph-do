"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { drawTodos, todosToDrawables } from "../../utils/drawTodos";
import { ClockHandle, ClockHandleStateSetters } from "./ClockHandle";
import { calcDegreesFrom } from "../../utils/math";
import { Clock } from "./Clock";
import { DEGREES_PER_HOUR } from "@/lib/utils/constants";
import { Todo } from "@/types/api";
import { addHours, formatDate, set } from "date-fns";
import { Button } from "@/components/ui/button/button";
import { calcClosestDistToClockHandle } from "../../utils/distToClockHandle";
import { Sunrise, Sun, Sunset, Moon } from "lucide-react";
import e from "express";

const RADIUS = 170;
const MAX_LAST_CLICK_DIFF_MS = 300;
interface Props {
  todos: Todo[];
  onFormOpen?: (data: Pick<Todo, "startsAt" | "due" | "color">) => void;
}

const today = new Date();
const currentTime = {
  hours: today.getHours(),
  minutes: today.getMinutes(),
};
const currentTimeDegrees =
  calcDegreesFrom(currentTime.hours, "hours") +
  calcDegreesFrom(currentTime.minutes / 60, "hours");

export function ClockGraph({ todos, onFormOpen }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const lastClickTimeRef = useRef(0);
  const [clockHandleDegrees, setClockHandleDegrees] =
    useState(currentTimeDegrees);
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
      startsAt: addHours(
        set(new Date(), { hours: 0, minutes: 0, seconds: 0 }),
        createTodoDegrees.start / DEGREES_PER_HOUR,
      ).toString(),
      due: addHours(
        set(new Date(), { hours: 0, minutes: 0, seconds: 0 }),
        createTodoDegrees.end / DEGREES_PER_HOUR,
      ).toString(),
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

    const viewHoursStart = (clockHandleDegrees / DEGREES_PER_HOUR) % 24;
    const copyTodos = [...todos];
    if (newTodo) copyTodos.push(newTodo as Todo);
    const drawableTodos = todosToDrawables(copyTodos);
    drawTodos({
      canvas,
      drawableTodos: drawableTodos,
      radius: RADIUS,
      viewHours: {
        start: Math.max(viewHoursStart - 6, 0),
        end: Math.min(24, viewHoursStart + 6),
      },
    });
  }, [todos, clockHandleDegrees, newTodo]);

  function handleQuickSwitchClick({
    stateSetters,
    index,
    event,
  }: {
    stateSetters: ClockHandleStateSetters;
    index: number;
    event: React.MouseEvent<HTMLButtonElement>;
  }) {
    event.stopPropagation();
    const angle = 180 * index;
    setClockHandleDegrees(angle);
    stateSetters.setTotalAngle(angle);
    stateSetters.setDisplayAngle(angle % 360);
  }

  function handleCreateTodoClick(e: React.MouseEvent<HTMLDivElement>) {
    // On the second double click we open the form
    if (typeof createTodoDegrees.start === "number" && newTodo) {
      setCreateTodoDegrees({ start: null, end: null });
      onFormOpen?.({
        ...newTodo,
        startsAt: new Date(newTodo.startsAt as string).toISOString(),
        due: new Date(newTodo.due as string).toISOString(),
      });
      return;
    }

    const lastClickTime = lastClickTimeRef.current;
    const currentClickTime = new Date().getTime();
    if (currentClickTime - lastClickTime < MAX_LAST_CLICK_DIFF_MS) {
      const offset = calcClosestDistToClockHandle({
        clickEvent: e,
        clockHandleDegrees,
      });

      setCreateTodoDegrees({
        start: clockHandleDegrees + offset,
        end: null,
      });
    }
    lastClickTimeRef.current = currentClickTime;
  }

  const shouldTrackNewTodo = typeof createTodoDegrees.start === "number";
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
      <div className="rounded-full" onClick={handleCreateTodoClick}>
        <ClockHandle
          startAngle={currentTimeDegrees}
          clockGraphRadius={RADIUS}
          onChange={({ totalAngle }) => {
            setClockHandleDegrees(totalAngle);
          }}
          renderButtons={(stateSetters) => (
            <div className="absolute">
              <div className="relative flex items-center justify-center w-28 h-28 mx-auto rounded-full">
                <button
                  className="absolute translate-x-6 -translate-y-6 opacity-40 hover:opacity-100
                    w-8 h-8 flex items-center justify-center text-gray-700 hover:text-slate-500
                    bg-white/40 rounded-full border transition-colors duration-300"
                  onClick={(e) =>
                    handleQuickSwitchClick({
                      stateSetters,
                      index: 1,
                      event: e,
                    })
                  }
                  title="Morning"
                >
                  <Sunrise className="w-5 h-5" />
                </button>

                <button
                  className="absolute translate-6 opacity-40 hover:opacity-100
                    w-8 h-8 flex items-center justify-center text-gray-700 hover:text-yellow-500
                    bg-white/40 rounded-full border transition-colors duration-300"
                  onClick={(e) =>
                    handleQuickSwitchClick({
                      stateSetters,
                      index: 2,
                      event: e,
                    })
                  }
                  title="Day"
                >
                  <Sun className="w-5 h-5" />
                </button>

                <button
                  className="absolute -translate-x-6 translate-y-6 opacity-40 hover:opacity-100
                    w-8 h-8 flex items-center justify-center text-gray-700 hover:text-purple-500
                    bg-white/40 rounded-full border transition-colors duration-300"
                  onClick={(e) =>
                    handleQuickSwitchClick({
                      stateSetters,
                      index: 3,
                      event: e,
                    })
                  }
                  title="Evening"
                >
                  <Sunset className="w-5 h-5" />
                </button>

                <button
                  className="absolute -translate-6 opacity-40 hover:opacity-100
                    w-8 h-8 flex items-center justify-center text-gray-700 hover:text-gray-800
                    bg-white/40 rounded-full border transition-colors duration-300"
                  onClick={(e) =>
                    handleQuickSwitchClick({
                      stateSetters,
                      index: 4,
                      event: e,
                    })
                  }
                  title="Night"
                >
                  <Moon className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        >
          {shouldTrackNewTodo && (
            <ClockHandle
              startAngle={createTodoDegrees.start ?? 0}
              clockGraphRadius={RADIUS}
              onChange={({ totalAngle }) => {
                if (!createTodoDegrees.start) return;
                if (totalAngle < createTodoDegrees.start) return;
                if (
                  totalAngle > clockHandleDegrees + 180 ||
                  totalAngle < clockHandleDegrees - 180
                )
                  return;
                setCreateTodoDegrees(({ start }) => ({
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
