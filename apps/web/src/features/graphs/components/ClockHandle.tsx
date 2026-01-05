import { ReactNode, useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import { MouseEvent } from "react";
import { calcDegreesFrom } from "@/lib/utils/math";
import { motion, AnimatePresence } from "motion/react";
import { addHours, formatDate, set } from "date-fns";
import { DEGREES_PER_HOUR } from "@/lib/utils/constants";
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
}

const HANDLE_BUTTON_SIZE_PX = 21;
export function ClockHandle({
  children,
  containerClassName = "",
  clockGraphRadius,
  startAngle = 0,
  onChange,
}: Props) {
  const [mouseDown, setMouseDown] = useState(false);
  const [mouseEnter, setMouseEnter] = useState(false);
  const [displayAngle, setDisplayAngle] = useState(startAngle % 360);
  const [totalAngle, setTotalAngle] = useState(startAngle);
  const lastRawAngleRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

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

    setTotalAngle((prev) => prev + delta);
    setDisplayAngle(raw);
    onChange?.({ totalAngle, delta });
  };
  const showTooltip = mouseEnter || mouseDown;
  return (
    <div
      ref={containerRef}
      className={twMerge(
        "relative flex justify-center items-center",
        containerClassName,
      )}
      onMouseUp={() => setMouseDown(false)}
      onMouseLeave={() => setMouseDown(false)}
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
          className="absolute flex justify-center items-center bg-slate-800/20 rounded-full cursor-grab -left-[11px]"
        >
          <div className="relative bg-slate-800 h-1 w-1 rounded-full">
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
                    {formatDate(
                      addHours(
                        set(new Date(), { hours: 0, minutes: 0, seconds: 0 }),
                        totalAngle / DEGREES_PER_HOUR,
                      ),
                      "p",
                    )}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        <div className="border-slate-800 border border-dotted h-[50%] w-full" />
        {/* <div className="bg-slate-900 h-2 w-2 rounded-full cursor-grab" /> */}
      </div>
      {children}
    </div>
  );
}
