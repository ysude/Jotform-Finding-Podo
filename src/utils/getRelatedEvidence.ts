import type {
  Evidence,
  RelatedEvidenceItem,
  RelatedReason,
} from "../types/evidence"

const TIME_WINDOW_MS = 45 * 60 * 1000

export function getRelatedEvidence(
  current: Evidence,
  allEvidence: Evidence[]
): RelatedEvidenceItem[] {
  return allEvidence
    .flatMap((item) => {
    if (item.id === current.id) {
        return []
    }

      const sharedPeople = item.people.filter((person) =>
        current.people.includes(person)
      )
      const reasons: RelatedReason[] = []

      if (sharedPeople.length > 0) {
        reasons.push("samePerson")
      }

      if (Boolean(current.location) && item.location === current.location) {
        reasons.push("sameLocation")
      }

      const hasComparableTimestamp =
        current.timestampMs !== null && item.timestampMs !== null

      if (hasComparableTimestamp) {
        const timestampDistance = Math.abs(
          (current.timestampMs as number) - (item.timestampMs as number)
        )

        if (timestampDistance <= TIME_WINDOW_MS) {
        reasons.push("sameTimeWindow")
        }
      }

      if (reasons.length === 0) {
        return []
      }

      return [
        {
          evidence: item,
          reasons,
          sharedPeople,
        },
      ]
    })
    .sort((left, right) => {
      const reasonScore = right.reasons.length - left.reasons.length

      if (reasonScore !== 0) {
        return reasonScore
      }

      if (current.timestampMs !== null) {
        const leftDistance =
          left.evidence.timestampMs === null
            ? Number.MAX_SAFE_INTEGER
            : Math.abs(left.evidence.timestampMs - current.timestampMs)
        const rightDistance =
          right.evidence.timestampMs === null
            ? Number.MAX_SAFE_INTEGER
            : Math.abs(right.evidence.timestampMs - current.timestampMs)

        if (leftDistance !== rightDistance) {
          return leftDistance - rightDistance
        }
      }

      return left.evidence.sortOrder - right.evidence.sortOrder
    })
}
