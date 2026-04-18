import type { Evidence } from "../types/evidence"

export function getRelatedEvidence(
  current: Evidence,
  allEvidence: Evidence[]
): Evidence[] {
  return allEvidence.filter((item) => {
    if (item.id === current.id) {
      return false
    }

    const sharesPerson = item.people.some((person) =>
      current.people.includes(person)
    )

    const sharesLocation =
      Boolean(current.location) && item.location === current.location

    return sharesPerson || sharesLocation
  })
}
