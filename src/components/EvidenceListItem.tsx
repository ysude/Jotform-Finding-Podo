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
          ? "border-jotform-orange bg-jotform-yellow/15"
          : "border-slate-200 bg-slate-50/60 hover:border-slate-300 hover:bg-white"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
            {evidence.type}
          </div>
          <h3 className="mt-1 text-sm font-semibold text-jotform-navy">
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
          <span className="rounded-full bg-jotform-blue/10 px-2 py-1 text-jotform-navy">
            <SearchHighlightedText
              text={evidence.location}
              query={searchQuery}
            />
          </span>
        ) : null}
        {evidence.people.map((person) => (
          <span
            key={person}
            className="rounded-full bg-jotform-yellow/20 px-2 py-1 text-jotform-navy"
          >
            <SearchHighlightedText text={person} query={searchQuery} />
          </span>
        ))}
        {evidence.urgency ? (
          <span className="rounded-full bg-jotform-orange/15 px-2 py-1 text-jotform-orange">
            urgency {evidence.urgency}
          </span>
        ) : null}
        {evidence.confidence ? (
          <span className="rounded-full bg-jotform-blue/15 px-2 py-1 text-jotform-blue">
            confidence {evidence.confidence}
          </span>
        ) : null}
        <span className="rounded-full bg-slate-100 px-2 py-1 text-slate-600">
          {evidence.people.length} people
        </span>
      </div>
    </button>
  )
}
