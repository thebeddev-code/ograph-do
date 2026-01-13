import { Ref } from "react";
interface Props {
  canvasRef: Ref<HTMLCanvasElement>;
}

export function Clock({ canvasRef }: Props) {
  const hourMarkers = Array.from({ length: 12 }, (_, i) => i + 1);
  const oneHourOffset = 30;
  return (
    <div className="relative h-[400px] w-[400px] rounded-full border border-slate-200 bg-linear-to-br from-slate-50 to-slate-200">
      <canvas className="h-full w-full" ref={canvasRef} />

      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        {/* minute/second ticks */}
        {Array.from({ length: 60 }, (_, i) => {
          const isHourTick = i % 5 === 0;
          return (
            <div
              key={i}
              className={`
                absolute bg-slate-400
                ${isHourTick ? "h-4 w-[2px]" : "h-2 w-px opacity-70"}
              `}
              style={{
                transform: `rotate(${i * 6}deg) translateY(-185px)`,
              }}
            />
          );
        })}

        {/* hour numbers */}
        {hourMarkers.map((h, i) => (
          <div
            key={h}
            className="absolute flex h-8 w-8 items-center justify-center"
            style={{
              transform: `rotate(${i * 30 + oneHourOffset}deg) translateY(-150px)`,
            }}
          >
            <div
              className="select-none text-sm font-semibold text-slate-700"
              style={{
                rotate: `-${i * 30 + oneHourOffset}deg`,
              }}
            >
              {h}
            </div>
          </div>
        ))}

        {/* center dot */}
        {/* <div className="absolute z-10 h-3 w-3 rounded-full bg-slate-700 shadow-sm" /> */}
        {/* <Time className="absolute z-20 bg-gray-200 p-1 rounded-sm font-bold text-sm text-slate-800" /> */}
      </div>
    </div>
  );
}
