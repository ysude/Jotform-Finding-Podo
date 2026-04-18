import type { Evidence } from "../types/evidence"

type RouteMapProps = {
  evidence: Evidence[]
  onSelectEvidence: (id: string) => void
}

function toRelativePositions(evidence: Evidence[]) {
  const points = evidence
    .filter((item) => item.coordinatesPoint)
    .map((item) => ({
      evidence: item,
      lat: item.coordinatesPoint!.lat,
      lng: item.coordinatesPoint!.lng,
    }))

  if (points.length === 0) {
    return []
  }

  const latitudes = points.map((point) => point.lat)
  const longitudes = points.map((point) => point.lng)
  const minLat = Math.min(...latitudes)
  const maxLat = Math.max(...latitudes)
  const minLng = Math.min(...longitudes)
  const maxLng = Math.max(...longitudes)

  return points.map((point) => ({
    evidence: point.evidence,
    x:
      maxLng === minLng ? 50 : ((point.lng - minLng) / (maxLng - minLng)) * 100,
    y:
      maxLat === minLat ? 50 : (1 - (point.lat - minLat) / (maxLat - minLat)) * 100,
  }))
}

export function RouteMap({ evidence, onSelectEvidence }: RouteMapProps) {
  const points = toRelativePositions(evidence)

  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
            Route map
          </p>
          <h2 className="mt-1 text-xl font-semibold text-slate-950">
            Location markers across the route
          </h2>
        </div>
        <p className="text-sm text-slate-500">Marker-based preview</p>
      </div>

      {points.length > 0 ? (
        <div className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,1fr)_260px]">
          <div className="relative min-h-[320px] overflow-hidden rounded-[1.5rem] border border-slate-200 bg-[radial-gradient(circle_at_top_left,_rgba(251,191,36,0.18),_transparent_35%),linear-gradient(135deg,_#e2e8f0,_#f8fafc)]">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.18)_1px,transparent_1px)] bg-[size:36px_36px]" />

            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <polyline
                fill="none"
                stroke="rgb(15 23 42 / 0.65)"
                strokeWidth="1.2"
                points={points.map((point) => `${point.x},${point.y}`).join(" ")}
              />
            </svg>

            {points.map((point, index) => (
              <button
                key={point.evidence.id}
                type="button"
                onClick={() => onSelectEvidence(point.evidence.id)}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${point.x}%`,
                  top: `${point.y}%`,
                }}
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white bg-slate-950 text-xs font-semibold text-white shadow-lg">
                  {index + 1}
                </span>
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {points.map((point, index) => (
              <button
                key={point.evidence.id}
                type="button"
                onClick={() => onSelectEvidence(point.evidence.id)}
                className="block w-full rounded-2xl border border-slate-200 px-4 py-3 text-left hover:border-slate-300"
              >
                <div className="text-xs uppercase tracking-[0.18em] text-slate-500">
                  Stop {index + 1}
                </div>
                <div className="mt-1 text-sm font-semibold text-slate-950">
                  {point.evidence.location}
                </div>
                <div className="mt-1 text-xs text-slate-500">
                  {point.evidence.timestamp}
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <p className="mt-6 text-sm text-slate-500">
          No coordinate markers available for the current route.
        </p>
      )}
    </section>
  )
}
