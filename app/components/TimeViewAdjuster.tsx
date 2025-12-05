import { ReactNode, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import { MouseEvent } from "react";
import { calcDegreesFrom } from "../lib/utils/math";

interface Props {
  children: ReactNode;
  containerClassName?: string;
  clockGraphRadius: number;
}

export function TimeViewAdjuster({
  children,
  containerClassName = "",
  clockGraphRadius,
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [mouseDown, setMouseDown] = useState(false);
  const [degrees, setDegrees] = useState(0);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!mouseDown) return;

    const rect = e.currentTarget.getBoundingClientRect();

    // center of the rotating element relative to viewport
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;
    const angleRadians = Math.atan2(dy, dx);
    let angleDeg = calcDegreesFrom(angleRadians);
    console.log(
      `Mouse x: ${e.clientX}\nMouse y: ${e.clientY}\nCentered x: ${dx}\nCentered y:${dy}`
    );
    if (angleDeg < 0) angleDeg += 360;
    setDegrees(angleDeg);
  };

  return (
    <div
      ref={containerRef}
      className={twMerge(
        "relative flex justify-center items-center",
        containerClassName
      )}
      onMouseMove={handleMouseMove}
    >
      <div
        style={{
          transform: `rotate(${degrees}deg)`,
          transformOrigin: "50% 50%",
          width: `${clockGraphRadius * 2 + 20}px`,
        }}
        onMouseDown={() => setMouseDown(true)}
        onMouseUp={() => setMouseDown(false)}
        className="absolute flex justify-end items-center h-1"
      >
        <div className=" h-5 w-5 bg-gray-500 rounded-full"></div>
      </div>
      {children}
    </div>
  );
}
