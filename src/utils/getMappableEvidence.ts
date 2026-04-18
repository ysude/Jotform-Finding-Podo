import type { Evidence } from "../types/evidence"

export function getMappableEvidence(evidence: Evidence[]): Evidence[] {
  return evidence.filter((item) => item.coordinatesPoint)
}
