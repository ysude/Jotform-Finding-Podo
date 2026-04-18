import type { Evidence } from "../types/evidence"

type EvidenceDetailProps = {
  evidence: Evidence | null
  relatedEvidence: Evidence[]
  onPersonClick: (person: string) => void
  onRelatedEvidenceClick: (id: string) => void
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
        <h3 className="text-sm font-semibold text-slate-900">Related records</h3>
        <div className="mt-3 space-y-2">
          {relatedEvidence.slice(0, 6).map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onRelatedEvidenceClick(item.id)}
              className="block w-full rounded-xl border border-slate-200 px-3 py-2 text-left hover:border-slate-300"
            >
              <div className="text-xs uppercase tracking-wide text-slate-500">
                {item.type}
              </div>
              <div className="mt-1 text-sm font-medium text-slate-900">
                {item.title}
              </div>
            </button>
          ))}
          {relatedEvidence.length === 0 ? (
            <p className="text-sm text-slate-500">No related records found.</p>
          ) : null}
        </div>
      </div>
    </section>
  )
}
