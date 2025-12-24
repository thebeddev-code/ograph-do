export function calcRadiansFrom(
  value: number,
  type: "hours" | "degrees" = "degrees"
) {
  let degrees = value;
  if (type == "hours") degrees = value * 30;
  // 360/2*Math.Pi = degrees/x
  // using cross multiplication to solve the proportion
  return (degrees * Math.PI) / 180;
}

export function calcDegreesFrom(
  value: number,
  type: "hours" | "radians" = "radians"
) {
  if (type == "hours") return value * 30;
  return (value * 180) / Math.PI; // Simplified conversion to degrees
}
