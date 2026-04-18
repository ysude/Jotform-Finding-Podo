import type { Evidence } from "../types/evidence"

type EvidenceListItemProps = {
  evidence: Evidence
  isSelected: boolean
  onSelect: (id: string) => void
}

export function EvidenceListItem({
  evidence,
  isSelected,
  onSelect,
}: EvidenceListItemProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(evidence.id)}
      className={`w-full rounded-2xl border p-4 text-left transition ${
        isSelected
          ? "border-amber-500 bg-amber-50"
          : "border-slate-200 bg-slate-50/60 hover:border-slate-300 hover:bg-white"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
            {evidence.type}
          </div>
          <h3 className="mt-1 text-sm font-semibold text-slate-900">
            {evidence.title}
          </h3>
        </div>
        <div className="text-xs text-slate-500">{evidence.timestamp}</div>
      </div>

      <p className="mt-2 line-clamp-2 text-sm text-slate-600">
        {evidence.summary}
      </p>

      <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500">
        {evidence.location ? (
          <span className="rounded-full bg-slate-100 px-2 py-1">
            {evidence.location}
          </span>
        ) : null}
        {evidence.people.map((person) => (
          <span key={person} className="rounded-full bg-slate-100 px-2 py-1">
            {person}
          </span>
        ))}
      </div>
    </button>
  )
}
