import type { Evidence } from "../types/evidence"
import { MapView } from "./MapView"
import { TimelineView } from "./TimelineView"

type CaseOverviewProps = {
  focusPerson: string | null
  focusPersonMessages: Evidence[]
  lastSighting: Evidence | null
  routeEvidence: Evidence[]
  selectedEvidence: Evidence | null
  onOpenDashboard: (id: string) => void
}

export function CaseOverview({
  focusPerson,
  focusPersonMessages,
  lastSighting,
  routeEvidence,
  selectedEvidence,
  onOpenDashboard,
}: CaseOverviewProps) {
  return (
    <div className="space-y-6">
      <section className="grid items-stretch gap-6 xl:grid-cols-[minmax(0,1.3fr)_minmax(320px,0.7fr)]">
        <MapView
          evidence={routeEvidence}
          selectedEvidence={selectedEvidence}
          variant="compact"
        />

        <div className="h-full rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
            Focus person
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-950">
            {focusPerson ?? "No linked person"}
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Latest messages connected to the person who appears with Podo in the
            final sighting.
          </p>

          <div className="mt-5 space-y-3">
            {focusPersonMessages.length > 0 ? (
              focusPersonMessages.map((message) => (
                <button
                  key={message.id}
                  type="button"
                  onClick={() => onOpenDashboard(message.id)}
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
                  <p className="mt-2 text-sm text-slate-600">{message.content}</p>
                </button>
              ))
            ) : (
              <p className="text-sm text-slate-500">
                No recent messages were found for this person.
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
          Latest sighting
        </p>
        {lastSighting ? (
          <>
            <div className="mt-2 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0">
                <h2 className="text-2xl font-semibold text-slate-950">
                  {lastSighting.title}
                </h2>
                <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-600">
                  {lastSighting.content}
                </p>
              </div>

              <button
                type="button"
                onClick={() => onOpenDashboard(lastSighting.id)}
                className="rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white"
              >
                Open in evidence dashboard
              </button>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 p-4">
                <div className="text-xs uppercase tracking-[0.18em] text-slate-500">
                  Time
                </div>
                <div className="mt-1 text-sm font-medium text-slate-950">
                  {lastSighting.timestamp}
                </div>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <div className="text-xs uppercase tracking-[0.18em] text-slate-500">
                  Location
                </div>
                <div className="mt-1 text-sm font-medium text-slate-950">
                  {lastSighting.location}
                </div>
              </div>
            </div>
          </>
        ) : (
          <p className="mt-3 text-sm text-slate-500">
            No Podo sighting was found in the dataset.
          </p>
        )}
      </section>

      <TimelineView
        evidence={routeEvidence}
        onSelectEvidence={onOpenDashboard}
      />
    </div>
  )
}
