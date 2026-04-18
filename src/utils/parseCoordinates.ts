import type { CoordinatePoint } from "../types/evidence"

export function parseCoordinates(value: string): CoordinatePoint | undefined {
  const trimmedValue = value.trim()

  if (!trimmedValue) {
    return undefined
  }

  const [lat, lng] = value
    .split(",")
    .map((part) => Number.parseFloat(part.trim()))

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return undefined
  }

  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    return undefined
  }

  return { lat, lng }
}
