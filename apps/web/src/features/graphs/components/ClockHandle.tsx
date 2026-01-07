import { ReactNode, useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import { MouseEvent } from "react";
import { calcDegreesFrom } from "@/lib/utils/math";
import { motion, AnimatePresence } from "motion/react";
import { addHours, formatDate, set } from "date-fns";
import { DEGREES_PER_HOUR } from "@/lib/utils/constants";
import { cn } from "@/utils/cn";

const HANDLE_BUTTON_SIZE_PX = 21;

interface Props {
  children: ReactNode;
  containerClassName?: string;
  clockGraphRadius: number;
  startAngle?: number;
  onChange?: ({
    totalAngle,
    delta,
  }: {
    totalAngle: number;
    delta: number;
  }) => void;
  variant?: "minimal" | "full";
  followMouse?: boolean;
  snapDegrees?: number;
}

export function ClockHandle({
  children,
  containerClassName = "",
  clockGraphRadius,
  startAngle = 0,
  onChange,
  followMouse = false,
  variant = "full",
  snapDegrees,
}: Props) {
  const [mouseDown, setMouseDown] = useState(followMouse);
  const [mouseEnter, setMouseEnter] = useState(followMouse);
  const [displayAngle, setDisplayAngle] = useState(startAngle % 360);
  const [totalAngle, setTotalAngle] = useState(startAngle);
  const lastRawAngleRef = useRef<number | null>(null);
  const lastSnapAngleRef = useRef<number>(startAngle);

  const timeAngle =
    typeof snapDegrees === "number" ? lastSnapAngleRef.current : totalAngle;
  const time = formatDate(
    addHours(
      set(new Date(), { hours: 0, minutes: 0, seconds: 0 }),
      timeAngle / DEGREES_PER_HOUR,
    ),
    "p",
  );
  const showTooltip = mouseEnter || mouseDown;

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!mouseDown) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;
    const angleRadians = Math.atan2(dx, -dy);
    let raw = calcDegreesFrom(angleRadians, "radians"); // -180..180 or similar, depending on your helper
    if (raw < 0) raw += 360; // 0..360

    if (lastRawAngleRef.current == null) {
      lastRawAngleRef.current = raw;
      return;
    }

    let delta = raw - lastRawAngleRef.current;

    // Fix wrap at 0/360
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;

    lastRawAngleRef.current = raw;
    const newTotalAngle = totalAngle + delta;
    setTotalAngle(newTotalAngle);
    if (
      typeof snapDegrees === "number" &&
      Math.abs((lastSnapAngleRef.current ?? 0) - newTotalAngle) < snapDegrees
    ) {
      return;
    }

    setDisplayAngle(raw);
    onChange?.({ totalAngle: newTotalAngle, delta });
    lastSnapAngleRef.current = newTotalAngle;
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (mouseDown) return;
      setTotalAngle((prev) => prev + DEGREES_PER_HOUR / 3600);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [mouseDown]);

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
        className="z-10 absolute flex justify-start items-center"
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
    </div>
  );
}
