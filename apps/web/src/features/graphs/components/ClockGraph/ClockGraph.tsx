"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { drawTodos } from "../../utils/drawTodos";
import { ClockHandle, ClockHandleStateSetters } from "./ClockHandle";
import { calcDegreesFrom } from "../../../../lib/utils/math";
import { Clock } from "./Clock";
import { DEGREES_PER_HOUR } from "@/lib/utils/constants";
import { Todo } from "@/types/api";
import { addHours, formatDate, set } from "date-fns";
import { DrawableTodo } from "@/lib/types";
import { Button } from "@/components/ui/button/button";

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
  const [newTodoDegrees, setNewTodoDegrees] = useState<{
    start: null | number;
    end: null | number;
  }>({
    start: null,
    end: null,
  });

  let drawableTodo: Pick<Todo, "startsAt" | "due" | "color"> | null = null;
  if (
    typeof newTodoDegrees.start === "number" &&
    typeof newTodoDegrees.end === "number"
  ) {
    drawableTodo = {
      startsAt: addHours(
        set(new Date(), { hours: 0, minutes: 0, seconds: 0 }),
        newTodoDegrees.start / DEGREES_PER_HOUR,
      ).toString(),
      due: addHours(
        set(new Date(), { hours: 0, minutes: 0, seconds: 0 }),
        newTodoDegrees.end / DEGREES_PER_HOUR,
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
    if (typeof newTodoDegrees.start === "number" && drawableTodo) {
      setNewTodoDegrees({ start: null, end: null });
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
      const rect = e.currentTarget.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      const angleRadians = Math.atan2(dx, -dy);
      let raw = calcDegreesFrom(angleRadians, "radians");
      if (raw < 0) raw += 360;

      const normalizedCurrentTimeDegrees = clockHandleDegrees % 360;

      const clockwise = (raw - normalizedCurrentTimeDegrees + 360) % 360;
      const counterclockwise = (normalizedCurrentTimeDegrees - raw + 360) % 360;

      /*
              If angle between currentTimeDegrees to 360 or 0 currentTimeDegrees + 180  
            
            */
      function isPastCurrentTimeAngle() {
        if (
          normalizedCurrentTimeDegrees < 360 &&
          (normalizedCurrentTimeDegrees + 180) % 360 <
            normalizedCurrentTimeDegrees
        ) {
          return (
            (normalizedCurrentTimeDegrees <= raw && raw <= 360) ||
            (raw >= 0 && raw <= (normalizedCurrentTimeDegrees + 180) % 360)
          );
        }
        return (
          normalizedCurrentTimeDegrees <= raw &&
          raw <= normalizedCurrentTimeDegrees + 180
        );
      }
      const offsetAngle = isPastCurrentTimeAngle()
        ? clockwise
        : -counterclockwise;
      setNewTodoDegrees({
        start: clockHandleDegrees + offsetAngle,
        end: null,
      });
    }
    lastClickTimeRef.current = currentClickTime;
  }

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
              startAngle={newTodoDegrees.start ?? 0}
              clockGraphRadius={RADIUS}
              onChange={({ totalAngle }) => {
                if (!newTodoDegrees.start) return;
                if (totalAngle < newTodoDegrees.start) return;
                if (
                  totalAngle > clockHandleDegrees + 180 ||
                  totalAngle < clockHandleDegrees - 180
                )
                  return;
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
