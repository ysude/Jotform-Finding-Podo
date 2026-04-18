export function normalizeName(name: string): string {
  const value = name.trim()

  if (!value) {
    return ""
  }

  const aliases: Record<string, string> = {
    kagan: "Kağan",
    "kağan a.": "Kağan",
  }

  const key = value.toLocaleLowerCase("tr-TR")

  return aliases[key] ?? value
}
