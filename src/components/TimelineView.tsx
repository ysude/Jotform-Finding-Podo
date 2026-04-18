import { useMemo, useState } from "react"
import type { Evidence } from "../types/evidence"

type TimelineViewProps = {
  evidence: Evidence[]
  onSelectEvidence: (id: string) => void
}

type TimelineTab = "recent" | "all"

export function TimelineView({
  evidence,
  onSelectEvidence,
}: TimelineViewProps) {
  const [activeTab, setActiveTab] = useState<TimelineTab>("recent")

  const visibleEvidence = useMemo(() => {
    if (activeTab === "all") {
      return evidence
    }

    return evidence.slice(-5)
  }, [activeTab, evidence])

  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
            Timeline
          </p>
          <h2 className="mt-1 text-xl font-semibold text-slate-950">
            Podo&apos;s route from oldest to newest
          </h2>
        </div>
        <p className="text-sm text-slate-500">{evidence.length} events</p>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setActiveTab("recent")}
          className={`rounded-full px-4 py-2 text-sm font-medium transition ${
            activeTab === "recent"
              ? "bg-slate-950 text-white"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          Recent 5 movements
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("all")}
          className={`rounded-full px-4 py-2 text-sm font-medium transition ${
            activeTab === "all"
              ? "bg-slate-950 text-white"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          Full timeline
        </button>
      </div>

      <div className="mt-6 space-y-4">
        {visibleEvidence.map((item, index) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelectEvidence(item.id)}
            className="flex w-full gap-4 rounded-2xl p-3 text-left transition hover:bg-slate-50"
          >
            <div className="flex w-10 flex-col items-center">
              <div className="mt-1 h-3 w-3 rounded-full bg-amber-500" />
              {index < visibleEvidence.length - 1 ? (
                <div className="mt-2 h-full w-px bg-slate-200" />
              ) : null}
            </div>

            <div className="min-w-0 flex-1 pb-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs uppercase tracking-[0.18em] text-slate-500">
                  {item.type}
                </div>
                <div className="text-xs text-slate-500">{item.timestamp}</div>
              </div>

              <h3 className="mt-1 text-sm font-semibold text-slate-950">
                {item.title}
              </h3>
              <p className="mt-1 text-sm text-slate-600">{item.summary}</p>
              <div className="mt-2 text-xs text-slate-500">{item.location}</div>
            </div>
          </button>
        ))}
      </div>
    </section>
  )
}
