import { ReactNode, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import { MouseEvent } from "react";
import { calcDegreesFrom } from "../lib/utils/math";

interface Props {
  children: ReactNode;
  containerClassName?: string;
  clockGraphRadius: number;
  onViewableTimeDegreesChange: (degrees: number) => void;
  viewableTimeDegrees: number;
}

const HANDLE_BUTTON_SIZE_PX = 21;
export function TimeViewAdjuster({
  children,
  containerClassName = "",
  clockGraphRadius,
  onViewableTimeDegreesChange,
  viewableTimeDegrees,
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [mouseDown, setMouseDown] = useState(false);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!mouseDown) return;

    const rect = e.currentTarget.getBoundingClientRect();

    // center of the rotating element relative to viewport
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;
    const angleRadians = Math.atan2(-dx, dy);
    let angleDeg = calcDegreesFrom(angleRadians);
    if (angleDeg < 0) angleDeg += 360;
    onViewableTimeDegreesChange(angleDeg);
  };

  return (
    <div
      ref={containerRef}
      className={twMerge(
        "relative flex justify-center items-center",
        containerClassName
      )}
      onMouseUp={() => setMouseDown(false)}
      onMouseLeave={() => setMouseDown(false)}
      onMouseMove={handleMouseMove}
    >
      <div
        style={{
          transform: `rotate(${viewableTimeDegrees + 90}deg)`,
          transformOrigin: "50% 50%",
          width: `${clockGraphRadius * 2 + HANDLE_BUTTON_SIZE_PX}px`,
        }}
        className="z-10 absolute flex justify-end items-center h-1 "
      >
        <div className="border-white border border-dotted h-[50%] w-full" />
        <div
          onMouseDown={() => setMouseDown(true)}
          style={{
            width: `${HANDLE_BUTTON_SIZE_PX}px`,
            height: `${HANDLE_BUTTON_SIZE_PX}px`,
          }}
          className="bg-white border-2 border-gray-400 rounded-full shadow-sm hover:shadow-md active:scale-95 transition-all duration-150 cursor-grab"
        />
      </div>
      {children}
    </div>
  );
}
