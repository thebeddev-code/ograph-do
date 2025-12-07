import { Ref } from "react";

interface Props {
  canvasRef: Ref<HTMLCanvasElement>;
}

export function Clock({ canvasRef }: Props) {
  return (
    <div className="relative w-[400px] h-[400px] rounded-full bg-gray-500 overflow-hidden">
      <canvas className="w-full h-full" ref={canvasRef} />
      <div className="absolute inset-0 flex items-center justify-center">
        {Array.from({ length: 48 }, (_, i) => (
          <div
            key={i}
            className="absolute w-px h-[5px] bg-red-50"
            style={{
              transform: `rotate(${i * 7.5}deg) translateY(-180px)`,
            }}
          />
        ))}
        {Array.from({ length: 12 }, (_, i) => (
          <div
            key={i}
            className="absolute w-[2px] h-[20px] bg-white"
            style={{
              transform: `rotate(${i * 30}deg) translateY(-180px)`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
