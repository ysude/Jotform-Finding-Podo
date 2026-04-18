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
    <section className="rounded-[2rem] border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-end justify-between gap-4 px-2">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
            Evidence feed
          </p>
          <h2 className="mt-1 text-lg font-semibold text-slate-950">
            Filtered investigation records
          </h2>
        </div>
        <p className="text-sm text-slate-500">{evidence.length} results</p>
      </div>

      <div className="space-y-3">
      {evidence.map((item) => (
        <EvidenceListItem
          key={item.id}
          evidence={item}
          isSelected={item.id === selectedEvidenceId}
          onSelect={onSelectEvidence}
        />
      ))}
      </div>
    </section>
  )
}
