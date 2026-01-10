"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { drawTodos } from "../../utils/drawTodos";
import { ClockHandle, ClockHandleStateSetters } from "./ClockHandle";
import { calcDegreesFrom } from "../../utils/math";
import { Clock } from "./Clock";
import { DEGREES_PER_HOUR } from "@/lib/utils/constants";
import { Todo } from "@/types/api";
import { addHours, formatDate, set } from "date-fns";
import { DrawableTodo } from "@/lib/types";
import { Button } from "@/components/ui/button/button";
import { calcClosestDistToClockHandle } from "../../utils/distToClockHandle";

const RADIUS = 170;
const MAX_LAST_CLICK_DIFF_MS = 300;
interface Props {
  drawableTodos: DrawableTodo[];
  onFormOpen?: (data: DrawableTodo) => void;
}

const today = new Date();
const currentTime = {
  hours: today.getHours(),
  minutes: today.getMinutes(),
};
const currentTimeDegrees =
  calcDegreesFrom(currentTime.hours, "hours") +
  calcDegreesFrom(currentTime.minutes / 60, "hours");

export function ClockGraph({ drawableTodos, onFormOpen }: Props) {
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

  let drawableTodo: Pick<Todo, "startsAt" | "due" | "color"> | null = null;
  if (
    typeof createTodoDegrees.start === "number" &&
    typeof createTodoDegrees.end === "number"
  ) {
    drawableTodo = {
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

  function handleQuickSwitchClick(
    stateSetters: ClockHandleStateSetters,
    index: number,
  ) {
    const angle = 180 * index;
    setClockHandleDegrees(angle);
    stateSetters.setTotalAngle(angle);
    stateSetters.setDisplayAngle(angle % 360);
  }

  function handleCreateTodoClick(e: React.MouseEvent<HTMLDivElement>) {
    // On the second double click we open the form
    if (typeof createTodoDegrees.start === "number" && drawableTodo) {
      setCreateTodoDegrees({ start: null, end: null });
      onFormOpen?.({
        ...drawableTodo,
        startsAt: new Date(drawableTodo.startsAt as string).toISOString(),
        due: new Date(drawableTodo.due as string).toISOString(),
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
            <div className="absolute -bottom-20 flex gap-4">
              <Button onClick={() => handleQuickSwitchClick(stateSetters, 1)}>
                Morning
              </Button>
              <Button onClick={() => handleQuickSwitchClick(stateSetters, 2)}>
                Day
              </Button>
              <Button onClick={() => handleQuickSwitchClick(stateSetters, 3)}>
                Evening
              </Button>
              <Button onClick={() => handleQuickSwitchClick(stateSetters, 4)}>
                Night
              </Button>
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
