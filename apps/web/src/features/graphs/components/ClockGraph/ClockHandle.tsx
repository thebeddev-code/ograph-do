import { addHours, formatDate, set } from "date-fns";
import { motion, AnimatePresence } from "motion/react";
import React, {
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { MouseEvent } from "react";
import { twMerge } from "tailwind-merge";

import { DEGREES_PER_HOUR } from "@/lib/utils/constants";
import { cn } from "@/utils/cn";

import {
  getCurrentTimeInDegrees,
  getMouseAngleInDegrees,
} from "../../utils/math";

import { ClockHandleTools } from "./ClockHandleTools";

const HANDLE_BUTTON_SIZE_PX = 21;

export type ClockHandleStateSetters = {
  setDisplayAngle: Dispatch<SetStateAction<number>>;
  setTotalAngle: Dispatch<SetStateAction<number>>;
};

export type AngleValue = {
  currentAngle: number;
  totalAngle: number;
};

interface Props {
  children: ReactNode;
  containerClassName?: string;
  clockGraphRadius: number;
  value: AngleValue;
  resetValue?: (v: AngleValue) => void;
  // TODO: rewrite to accept an object instead
  onChange: (delta: number, total?: number) => void;
  variant?: "minimal" | "full";
  followMouse?: boolean;
  shouldUpdateTime?: boolean;
  controlled?: boolean
}

export function ClockHandle({
  children,
  containerClassName = "",
  clockGraphRadius,
  value,
  onChange,
  followMouse = false,
  variant = "full",
  resetValue,
  controlled = true
}: Props) {
  const [handleDegrees, setHandleDegrees] = useState({
    total: value.totalAngle,
    mouse: value.totalAngle % 360
  })
  const [mouseDown, setMouseDown] = useState(followMouse);
  const [mouseEnter, setMouseEnter] = useState(followMouse);
  const lastRawAngleRef = useRef<number | null>(null);
  const [hasUsedQuickSwitch, setHasUsedQuickSwitch] = useState(false);
  const { currentAngle, totalAngle } = value;
  const t = controlled ? handleDegrees.total : totalAngle;
  const time = formatDate(
    addHours(
      set(new Date(), { hours: 0, minutes: 0, seconds: 0 }),
      t / DEGREES_PER_HOUR,
    ),
    "p",
  );
  const showTooltip = true;
  // Handle resetting the last raw angle after clock handle reset

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!mouseDown) return;

    const mouseDegrees = getMouseAngleInDegrees(e);
    if (lastRawAngleRef.current == null) {
      lastRawAngleRef.current = mouseDegrees;
      return;
    }

    let delta = mouseDegrees - lastRawAngleRef.current;
    // Fix wrap at 0/360
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;

    lastRawAngleRef.current = mouseDegrees;

    const newTotal = handleDegrees.total + delta;
    if (!controlled) {
      setHandleDegrees({
        mouse: mouseDegrees,
        total: newTotal,
      })
    }
    onChange?.(delta, newTotal);

  };

  function handleQuickTimeSwitchClick({
    index = 1,
    event,
    resetClockHandle,
  }: {
    index?: number;
    event: React.MouseEvent<HTMLButtonElement>;
    resetClockHandle?: boolean;
  }) {
    event.stopPropagation();
    if (resetClockHandle) {
      const currentTimeDegrees = getCurrentTimeInDegrees();
      resetValue?.({
        currentAngle: currentTimeDegrees % 360,
        totalAngle: currentTimeDegrees,
      });
      // Resetting the last raw angle, very important
      lastRawAngleRef.current = null;
      setHasUsedQuickSwitch(false);
      return;
    }
    // So, we know that conversion rate of degrees to hours is 30 degrees because {360 / 12 = 30}
    const angle = 180 * index;

    // Small offset to correctly calculate part of the day
    const offset = DEGREES_PER_HOUR * (1 / 60 / 60);
    resetValue?.({
      currentAngle: angle % 360,
      totalAngle: angle + offset,
    });

    // Do not increase the clock handle angle with time passage
    setHasUsedQuickSwitch(true);
  }

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (mouseDown || hasUsedQuickSwitch) return;
      onChange(DEGREES_PER_HOUR / 3600);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [mouseDown, hasUsedQuickSwitch]);

  const displayAngle = controlled ? currentAngle : handleDegrees.total;
  return (
    <div
      className={twMerge(
        "relative flex justify-center items-center",
        containerClassName,
      )}
      onMouseUp={() => {
        if (!followMouse) setMouseDown(false);
      }}
      onMouseLeave={() => {
        if (!followMouse) setMouseDown(false);
      }}
      onMouseMove={handleMouseMove}
    >
      <div
        style={{
          transform: `rotate(${displayAngle + 90}deg)`,
          transformOrigin: "50% 50%",
          width: `${clockGraphRadius * 2 + HANDLE_BUTTON_SIZE_PX}px`,
        }}
        className={cn("z-10 absolute flex justify-start items-center")}
      >
        <div
          onMouseDown={() => setMouseDown(true)}
          onMouseEnter={() => setMouseEnter(true)}
          onMouseLeave={() => setMouseEnter(false)}
          style={{
            width: `${HANDLE_BUTTON_SIZE_PX}px`,
            height: `${HANDLE_BUTTON_SIZE_PX}px`,
          }}
          className={cn(
            "absolute flex justify-center items-center bg-slate-800/20 rounded-full  -left-[11px]",
            {
              "cursor-grab": variant === "full",
            },
          )}
        >
          <div
            className={cn({
              "relative bg-slate-800 h-1 w-1 rounded-full": variant === "full",
            })}
          >
            <AnimatePresence>
              {showTooltip && (
                <motion.div
                  initial={{ opacity: 0, y: 4, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  className="absolute -translate-x-20 select-none
                     bg-muted px-3 py-1 rounded-full "
                  style={{
                    rotate: `-${Math.round(displayAngle + 90)}deg`,
                    transformOrigin: "center center",
                  }}
                >
                  <span className="whitespace-nowrap text-xs text-muted-foreground font-medium">
                    {time}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        <div
          className={cn("border-slate-800/40 border h-[50%] w-[50%]", {
            "border-dotted w-full": variant === "full",
          })}
        />
        {/* <div className="bg-slate-900 h-2 w-2 rounded-full cursor-grab" /> */}
      </div>
      {children}
      {variant === "full" && <ClockHandleTools onQuickTimeSwitchClick={handleQuickTimeSwitchClick} />}
    </div>
  );
}
