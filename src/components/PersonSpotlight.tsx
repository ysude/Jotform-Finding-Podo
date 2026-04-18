import type { Evidence } from "../types/evidence"

type PersonSpotlightProps = {
  evidence: Evidence | null
  relatedMessages: Evidence[]
  relatedLocations: string[]
  totalRecordCount: number
  onOpenEvidence: (id: string) => void
  onPersonClick: (person: string) => void
}

export function PersonSpotlight({
  evidence,
  relatedMessages,
  relatedLocations,
  totalRecordCount,
  onOpenEvidence,
  onPersonClick,
}: PersonSpotlightProps) {
  const primaryPerson =
    evidence?.people.find((person) => person !== "Podo") ?? evidence?.people[0] ?? null

  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
        Person spotlight
      </p>
      <h2 className="mt-1 text-xl font-semibold text-slate-950">
        {primaryPerson ?? "No focus person"}
      </h2>

      {primaryPerson ? (
        <>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="text-xs uppercase tracking-[0.18em] text-slate-500">
                Record count
              </div>
              <div className="mt-1 text-lg font-semibold text-slate-950">
                {totalRecordCount}
              </div>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="text-xs uppercase tracking-[0.18em] text-slate-500">
                Recent locations
              </div>
              <div className="mt-1 text-sm font-medium text-slate-950">
                {relatedLocations.slice(0, 2).join(", ") || "Unknown"}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onPersonClick(primaryPerson)}
            className="mt-4 rounded-full bg-amber-100 px-4 py-2 text-sm font-medium text-amber-900"
          >
            Filter dashboard to {primaryPerson}
          </button>

          <div className="mt-5 space-y-3">
            <h3 className="text-sm font-semibold text-slate-900">
              Latest messages
            </h3>
            {relatedMessages.length > 0 ? (
              relatedMessages.map((message) => (
                <button
                  key={message.id}
                  type="button"
                  onClick={() => onOpenEvidence(message.id)}
                  className="block w-full rounded-2xl border border-slate-200 px-4 py-3 text-left hover:border-slate-300"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="text-sm font-semibold text-slate-950">
                      {message.title}
                    </div>
                    <div className="text-xs text-slate-500">
                      {message.timestamp}
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">{message.summary}</p>
                </button>
              ))
            ) : (
              <p className="text-sm text-slate-500">
                No recent messages for this person.
              </p>
            )}
          </div>
        </>
      ) : (
        <p className="mt-3 text-sm text-slate-500">
          Select a record to spotlight a linked person.
        </p>
      )}
    </section>
  )
}
