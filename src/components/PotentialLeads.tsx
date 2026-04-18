type LeadItem = {
  name: string
  score: number
  reasons: string[]
}

type PotentialLeadsProps = {
  leads: LeadItem[]
  onPersonClick: (person: string) => void
}

export function PotentialLeads({
  leads,
  onPersonClick,
}: PotentialLeadsProps) {
  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
        Potential leads
      </p>
      <h2 className="mt-1 text-xl font-semibold text-slate-950">
        People worth checking next
      </h2>

      <div className="mt-5 space-y-3">
        {leads.length > 0 ? (
          leads.map((lead) => (
            <button
              key={lead.name}
              type="button"
              onClick={() => onPersonClick(lead.name)}
              className="block w-full rounded-2xl border border-slate-200 px-4 py-3 text-left hover:border-slate-300"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm font-semibold text-slate-950">
                  {lead.name}
                </div>
                <div className="rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-900">
                  score {lead.score}
                </div>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {lead.reasons.map((reason) => (
                  <span
                    key={reason}
                    className="rounded-full bg-slate-100 px-2 py-1 text-[11px] text-slate-600"
                  >
                    {reason}
                  </span>
                ))}
              </div>
            </button>
          ))
        ) : (
          <p className="text-sm text-slate-500">
            No clear lead candidates were derived from the current dataset.
          </p>
        )}
      </div>
    </section>
  )
}
