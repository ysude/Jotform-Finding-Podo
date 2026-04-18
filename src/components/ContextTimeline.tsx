import type { Evidence } from "../types/evidence"

type ContextTimelineProps = {
  evidence: Evidence[]
  onOpenEvidence: (id: string) => void
}

export function ContextTimeline({
  evidence,
  onOpenEvidence,
}: ContextTimelineProps) {
  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
            Time context
          </p>
          <h2 className="mt-1 text-xl font-semibold text-jotform-navy">
            Events around the same time
          </h2>
        </div>
        <p className="text-sm text-slate-500">{evidence.length} events</p>
      </div>

      <div className="mt-5 space-y-3">
        {evidence.length > 0 ? (
          evidence.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onOpenEvidence(item.id)}
            className="block w-full rounded-2xl border border-slate-200 px-4 py-3 text-left hover:border-slate-300"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs uppercase tracking-[0.18em] text-slate-500">
                {item.type}
              </div>
              <div className="text-xs text-slate-500">{item.timestamp}</div>
            </div>
            <div className="mt-1 text-sm font-semibold text-jotform-navy">
              {item.title}
            </div>
            <p className="mt-1 text-sm text-slate-600">{item.summary}</p>
          </button>
          ))
        ) : (
          <p className="text-sm text-slate-500">
            No nearby events were found in the same time window.
          </p>
        )}
      </div>
    </section>
  )
}
