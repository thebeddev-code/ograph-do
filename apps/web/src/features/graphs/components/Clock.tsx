import { Ref } from "react";

interface Props {
  canvasRef: Ref<HTMLCanvasElement>;
}

export function Clock({ canvasRef }: Props) {
  const hourMarkers = [];
  for (let i = 1; i <= 12; ++i) hourMarkers[i] = i;
  return (
    <div className="relative w-[400px] h-[400px] rounded-full overflow-hidden">
      <canvas className="w-full h-full" ref={canvasRef} />
      <div className="absolute inset-0 flex items-center justify-center">
        {Array.from({ length: 48 }, (_, i) => (
          <div
            key={i}
            className="absolute w-px h-[5px] bg-slate-400"
            style={{
              transform: `rotate(${i * 7.5}deg) translateY(-180px)`,
            }}
          />
        ))}
        {hourMarkers.map((h, i) => (
          <div
            className="absolute"
            key={i}
            style={{
              transform: `rotate(${i * 30}deg) translateY(-180px)`,
            }}
          >
            <div
              className="bg-white text-slate-800 select-none"
              style={{
                rotate: `-${i * 30}deg`,
              }}
            >
              {h}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
