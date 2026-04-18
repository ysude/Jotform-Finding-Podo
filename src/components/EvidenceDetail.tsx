import type { Evidence, RelatedEvidenceItem, RelatedReason } from "../types/evidence"

type EvidenceDetailProps = {
  evidence: Evidence | null
  relatedEvidence: RelatedEvidenceItem[]
  onPersonClick: (person: string) => void
  onRelatedEvidenceClick: (id: string) => void
}

const reasonLabels: Record<RelatedReason, string> = {
  samePerson: "Shared person",
  sameLocation: "Shared location",
  sameTimeWindow: "Same time window",
}

export function EvidenceDetail({
  evidence,
  relatedEvidence,
  onPersonClick,
  onRelatedEvidenceClick,
}: EvidenceDetailProps) {
  if (!evidence) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">
          Select a record
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Pick an evidence item from the list to inspect full details.
        </p>
      </div>
    )
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-wide text-slate-500">
        <span>{evidence.type}</span>
        <span>{evidence.timestamp}</span>
      </div>

      <h2 className="mt-2 text-2xl font-semibold text-slate-900">
        {evidence.title}
      </h2>

      <div className="mt-4 space-y-3 text-sm text-slate-700">
        <p>{evidence.content}</p>
        <p>
          <span className="font-medium text-slate-900">Location:</span>{" "}
          {evidence.location || "Unknown"}
        </p>
        {evidence.coordinates ? (
          <p>
            <span className="font-medium text-slate-900">Coordinates:</span>{" "}
            {evidence.coordinates}
          </p>
        ) : null}
        {evidence.urgency ? (
          <p>
            <span className="font-medium text-slate-900">Urgency:</span>{" "}
            {evidence.urgency}
          </p>
        ) : null}
        {evidence.confidence ? (
          <p>
            <span className="font-medium text-slate-900">Confidence:</span>{" "}
            {evidence.confidence}
          </p>
        ) : null}
      </div>

      <div className="mt-6">
        <h3 className="text-sm font-semibold text-slate-900">People</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {evidence.people.map((person) => (
            <button
              key={person}
              type="button"
              onClick={() => onPersonClick(person)}
              className="rounded-full bg-amber-100 px-3 py-1 text-sm text-amber-900"
            >
              {person}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-sm font-semibold text-slate-900">Linked records</h3>
        <div className="mt-3 space-y-2">
          {relatedEvidence.slice(0, 8).map((item) => (
            <button
              key={item.evidence.id}
              type="button"
              onClick={() => onRelatedEvidenceClick(item.evidence.id)}
              className="block w-full rounded-xl border border-slate-200 px-3 py-2 text-left hover:border-slate-300"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs uppercase tracking-wide text-slate-500">
                  {item.evidence.type}
                </div>
                <div className="text-xs text-slate-500">
                  {item.evidence.timestamp}
                </div>
              </div>
              <div className="mt-1 text-sm font-medium text-slate-900">
                {item.evidence.title}
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {item.reasons.map((reason) => (
                  <span
                    key={reason}
                    className="rounded-full bg-slate-100 px-2 py-1 text-[11px] text-slate-600"
                  >
                    {reasonLabels[reason]}
                  </span>
                ))}
                {item.sharedPeople.map((person) => (
                  <span
                    key={person}
                    className="rounded-full bg-amber-100 px-2 py-1 text-[11px] text-amber-900"
                  >
                    {person}
                  </span>
                ))}
              </div>
            </button>
          ))}
          {relatedEvidence.length === 0 ? (
            <p className="text-sm text-slate-500">No linked records found.</p>
          ) : null}
        </div>
      </div>
    </section>
  )
}
