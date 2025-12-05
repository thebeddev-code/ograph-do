import { types } from "node:util";

export function calcRadiansFrom(
  value: number,
  type: "hours" | "degrees" = "degrees"
) {
  let degrees = value;
  if (type == "hours") degrees = value * 30;
  // 360/2*Math.Pi = degrees/x
  // using cross multiplication to solve the proportion
  return (degrees * 2 * Math.PI) / 360;
}

export function calcDegreesFrom(radians: number) {
  return (radians * 180) / Math.PI; // Simplified conversion to degrees
}
