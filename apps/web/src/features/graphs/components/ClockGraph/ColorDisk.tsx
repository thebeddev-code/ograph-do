import { useEffect, useRef } from "react";
import { calcRadiansFrom } from "../../utils/math";

interface Props {
  degrees: number;
  config: Record<string, number>;
}
export function ColorDisk({ config, degrees: currentDegrees }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    const drawArc = (
      degreesStart: number,
      degreesEnd: number,
      offset: number,
      color: string,
      opacity: number = 1,
    ) => {
      if (!ctx) return;

      const toRad = (deg: number) => (deg * Math.PI) / 180;
      const startAngle = toRad(degreesStart - offset);
      const endAngle = toRad(degreesEnd - offset);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = Math.min(centerX, centerY) * 0.8;

      ctx.globalAlpha = opacity;
      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, startAngle, endAngle, false);
      ctx.lineWidth = 20;
      ctx.strokeStyle = color;
      ctx.stroke();
      ctx.restore();
    };

    const marks = Object.entries(config).sort((a, b) => a[1] - b[1]);
    // opacity for the past 6 hours time window
    const opacity = 0.5;
    // Think of this as a multicolor line segment, with start and end degrees
    for (let i = 0; i < marks.length; ++i) {
      // this is the end
      let [color, degreesEnd] = marks[i];
      //   this is the start
      let degreesStart = degreesEnd - 180;
      if (degreesStart <= currentDegrees && currentDegrees <= degreesEnd) {
        degreesStart = degreesStart % 360;
        degreesEnd = degreesEnd % 360;
        if (degreesEnd === 0) degreesEnd += 360;

        // the left half side (before the clock handle)
        drawArc(degreesStart, currentDegrees, 90, color);
        // the right half side (after the clock handle)
        drawArc(currentDegrees, degreesEnd, 90, color);

        // The other halfs ... think of this as number
        // the left half side (before the clock handle)
        drawArc(
          currentDegrees - 180,
          degreesStart,
          90,
          marks[i - 1]?.[0] ?? marks.at(-1)?.[0],
        );
        // the right half side (after the clock handle)
        drawArc(
          degreesEnd,
          (currentDegrees + 180) % 360,
          90,
          marks[(i + 1) % marks.length]?.[0] ?? "cyan",
        );
      }
    }
  }, [currentDegrees]);

  return (
    <div className=" left-0 top-0 translate-1/2 absolute h-50 w-50 rounded-full">
      <canvas ref={canvasRef} className="w-full h-full rounded-full" />
    </div>
  );
}
