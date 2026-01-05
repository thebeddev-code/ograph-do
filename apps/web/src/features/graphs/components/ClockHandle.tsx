import { ReactNode, useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import { MouseEvent } from "react";
import { calcDegreesFrom } from "@/lib/utils/math";

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
          style={{
            width: `${HANDLE_BUTTON_SIZE_PX}px`,
            height: `${HANDLE_BUTTON_SIZE_PX}px`,
          }}
          className="absolute flex justify-center items-center bg-slate-800/20 rounded-full cursor-grab -left-[11px]"
        >
          <div className="bg-slate-800 h-1 w-1 rounded-full" />
        </div>
        <div className="border-slate-800 border border-dotted h-[50%] w-full" />
        {/* <div className="bg-slate-900 h-2 w-2 rounded-full cursor-grab" /> */}
      </div>
      {children}
    </div>
  );
}
