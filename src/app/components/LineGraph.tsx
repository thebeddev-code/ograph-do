import { useMemo } from "react";
import { drawTodos } from "../../lib/draw";

interface Props {
  todos: Todo[];
  visibleTimeWindowStart: number;
}
export function LineGraph({ todos, visibleTimeWindowStart }: Props) {
  type DrawLineGraphTodo = {
    drawPercentage: number;
    color: string;
    dir: "left" | "right";
  };

  const arr: DrawLineGraphTodo[] = new Array(24).fill({
    drawPercentage: 0,
    color: "",
    dir: "",
  });
  for (const t of todos) {
    for (let i = t.start.hour; i < t.end.hour; ++i) {
      arr[i > 24 ? 24 : i] = {
        color: t.color,
        dir: "right",
        drawPercentage: 100,
      };
    }

    if (t.start.minutes > 0) {
      arr[t.start.hour].drawPercentage = ((60 - t.start.minutes) / 60) * 100;
    }

    if (t.end.minutes > 0) {
      arr[t.end.hour].drawPercentage = (t.end.minutes / 60) * 100;
      arr[t.end.hour].dir = "left";
    }
  }
  return (
    <div className="flex mt-10 border">
      {arr.map(({ drawPercentage, color, dir }, i) => {
        // no percentage, just solid bg
        if (drawPercentage == 0) {
          return <div key={`d${i}`} className={`h-10 w-10 bg-${color}`} />;
        }

        // 100%: all color
        if (drawPercentage === 100) {
          return <div key={`d${i}`} className={`h-10 w-10 bg-${color}`} />;
        }

        // build gradient based on dir
        const fromColor = dir === "right" ? "white" : color;
        const toColor = dir === "right" ? color : "white";

        return (
          <div
            key={`d${i}`}
            className="h-10 w-10"
            style={{
              background: `linear-gradient(to ${dir}, ${fromColor} ${
                100 - drawPercentage
              }%, ${toColor} ${100 - drawPercentage}%)`,
            }}
          />
        );
      })}
    </div>
  );
}
