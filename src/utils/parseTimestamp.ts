export function parseTimestamp(value: string): number | null {
  const trimmedValue = value.trim()

  if (!trimmedValue) {
    return null
  }

  const match = trimmedValue.match(
    /^(\d{2})-(\d{2})-(\d{4}) (\d{2}):(\d{2})$/
  )

  if (!match) {
    console.warn("Invalid timestamp format", value)
    return null
  }

  const [, day, month, year, hours, minutes] = match

  const timestamp = new Date(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hours),
    Number(minutes)
  ).getTime()

  if (!Number.isFinite(timestamp)) {
    console.warn("Invalid timestamp value", value)
    return null
  }

  return timestamp
}
