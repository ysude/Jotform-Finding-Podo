import type { Evidence } from "../types/evidence"
import { SearchHighlightedText } from "./SearchHighlightedText"

type EvidenceListItemProps = {
  evidence: Evidence
  isSelected: boolean
  onSelect: (id: string) => void
  searchQuery: string
}

export function EvidenceListItem({
  evidence,
  isSelected,
  onSelect,
  searchQuery,
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
            <SearchHighlightedText text={evidence.title} query={searchQuery} />
          </h3>
        </div>
        <div className="text-xs text-slate-500">{evidence.timestamp}</div>
      </div>

      <p className="mt-2 line-clamp-2 text-sm text-slate-600">
        <SearchHighlightedText text={evidence.summary} query={searchQuery} />
      </p>

      <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500">
        {evidence.location ? (
          <span className="rounded-full bg-slate-100 px-2 py-1">
            <SearchHighlightedText
              text={evidence.location}
              query={searchQuery}
            />
          </span>
        ) : null}
        {evidence.people.map((person) => (
          <span key={person} className="rounded-full bg-slate-100 px-2 py-1">
            <SearchHighlightedText text={person} query={searchQuery} />
          </span>
        ))}
        {evidence.urgency ? (
          <span className="rounded-full bg-rose-100 px-2 py-1 text-rose-700">
            urgency {evidence.urgency}
          </span>
        ) : null}
        {evidence.confidence ? (
          <span className="rounded-full bg-emerald-100 px-2 py-1 text-emerald-700">
            confidence {evidence.confidence}
          </span>
        ) : null}
        <span className="rounded-full bg-slate-100 px-2 py-1">
          {evidence.people.length} people
        </span>
      </div>
    </button>
  )
}
