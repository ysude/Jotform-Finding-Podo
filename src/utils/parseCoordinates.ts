import type { CoordinatePoint } from "../types/evidence"

export function parseCoordinates(value: string): CoordinatePoint | undefined {
  const [lat, lng] = value
    .split(",")
    .map((part) => Number.parseFloat(part.trim()))

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return undefined
  }

  return { lat, lng }
}
