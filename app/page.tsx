"use client";
import { useEffect, useRef, useState } from "react";

type TodoTime = {
  hour: number;
  minutes: number;
};

type Todo = {
  start: TodoTime;
  end: TodoTime;
};

const todos: Todo[][] = [
  [],
  [
    {
      start: {
        hour: 6,
        minutes: 30,
      },
      end: {
        hour: 8,
        minutes: 0,
      },
    },
    {
      start: {
        hour: 8,
        minutes: 30,
      },
      end: {
        hour: 10,
        minutes: 0,
      },
    },
  ],
  [],
];

export default function Home() {
  const [viewerString, setViewerString] = useState("6:00");
  const cancasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const [n, n1] = viewerString.split(":");
    const parsedN = parseInt(n);
    const parsedN1 = parseInt(n1);

    const canvas = cancasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    // Set internal resolution
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    // Scale drawing context
    ctx.scale(dpr, dpr);

    // Draw circle
    ctx.beginPath();
    ctx.arc(rect.width / 2, rect.height / 2, 200, 0, 2 * Math.PI);
    ctx.strokeStyle = "white";
    ctx.stroke();

    if (Number.isInteger(parsedN) && Number.isInteger(parsedN1)) {
      for (const t of todos[1]) {
        const { hour, minutes } = t.start;
        const { hour: endHour, minutes: endMinutes } = t.end;
        // const totalHours = endHour - hour;
        // ctx.beginPath();
        // ctx.arc(rect.width / 2, rect.height / 2, 200, 0, 2 * Math.PI);
        // ctx.strokeStyle = "white";
        // ctx.stroke();
      }
    }
  }, [viewerString]);
  return (
    <main className="bg-black flex">
      <canvas className="w-dvw h-dvh" ref={cancasRef}></canvas>
      <input
        className="bg-white w-20 h-10 absolute bottom-0 left-[45%]"
        type="text"
        value={viewerString}
        onChange={(e) => setViewerString(e.currentTarget.value)}
      />
    </main>
  );
}
