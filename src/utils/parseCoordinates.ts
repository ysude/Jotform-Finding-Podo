import type { CoordinatePoint } from "../types/evidence"

export function parseCoordinates(value: string): CoordinatePoint | undefined {
  const trimmedValue = value.trim()

  if (!trimmedValue) {
    return undefined
  }

  const [lat, lng, ...rest] = trimmedValue
    .split(",")
    .map((part) => Number.parseFloat(part.trim()))

  if (rest.length > 0) {
    console.warn("Invalid coordinate string, too many parts", value)
    return undefined
  }

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    console.warn("Invalid coordinate string, non-numeric value", value)
    return undefined
  }

  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    console.warn("Invalid coordinate string, out of range", value)
    return undefined
  }

  return { lat, lng }
}
