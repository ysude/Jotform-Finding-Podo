import type { Evidence } from "../types/evidence"
import { EvidenceListItem } from "./EvidenceListItem"

type EvidenceListProps = {
  evidence: Evidence[]
  selectedEvidenceId: string | null
  onSelectEvidence: (id: string) => void
}

export function EvidenceList({
  evidence,
  selectedEvidenceId,
  onSelectEvidence,
}: EvidenceListProps) {
  return (
    <section className="space-y-3">
      {evidence.map((item) => (
        <EvidenceListItem
          key={item.id}
          evidence={item}
          isSelected={item.id === selectedEvidenceId}
          onSelect={onSelectEvidence}
        />
      ))}
    </section>
  )
}
