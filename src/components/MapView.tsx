import { useEffect, useMemo } from "react"
import {
  CircleMarker,
  MapContainer,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet"
import type { Evidence } from "../types/evidence"
import { getMappableEvidence } from "../utils/getMappableEvidence"

type MapViewProps = {
  evidence: Evidence[]
  selectedEvidence: Evidence | null
  onSelectEvidence: (id: string) => void
}

const ANKARA_CENTER: [number, number] = [39.9334, 32.8597]
const DEFAULT_ZOOM = 12
const FOCUSED_ZOOM = 14

function previewText(value: string, maxLength = 120) {
  if (value.length <= maxLength) {
    return value
  }

  return `${value.slice(0, maxLength).trim()}...`
}

function MapFocusController({ selectedEvidence }: { selectedEvidence: Evidence | null }) {
  const map = useMap()

  useEffect(() => {
    if (selectedEvidence?.coordinatesPoint) {
      map.setView(
        [selectedEvidence.coordinatesPoint.lat, selectedEvidence.coordinatesPoint.lng],
        FOCUSED_ZOOM,
        { animate: false }
      )

      return
    }

    map.setView(ANKARA_CENTER, DEFAULT_ZOOM, { animate: false })
  }, [map, selectedEvidence])

  return null
}

export function MapView({
  evidence,
  selectedEvidence,
  onSelectEvidence,
}: MapViewProps) {
  const mappableEvidence = useMemo(() => getMappableEvidence(evidence), [evidence])

  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
            Investigation map
          </p>
          <h2 className="mt-1 text-xl font-semibold text-slate-950">
            Evidence markers across Ankara
          </h2>
        </div>
        <p className="text-sm text-slate-500">
          {mappableEvidence.length} mappable records
        </p>
      </div>

      {mappableEvidence.length > 0 ? (
        <div className="mt-6 overflow-hidden rounded-[1.5rem] border border-slate-200">
          <div className="aspect-video w-full">
            <MapContainer
              center={ANKARA_CENTER}
              zoom={DEFAULT_ZOOM}
              scrollWheelZoom={false}
              className="h-full w-full"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <MapFocusController selectedEvidence={selectedEvidence} />

              {mappableEvidence.map((item) => (
                <CircleMarker
                  key={item.id}
                  center={[
                    item.coordinatesPoint!.lat,
                    item.coordinatesPoint!.lng,
                  ]}
                  eventHandlers={{
                    click: () => onSelectEvidence(item.id),
                  }}
                  pathOptions={{
                    color:
                      selectedEvidence?.id === item.id
                        ? "rgb(217 119 6)"
                        : "rgb(15 23 42)",
                    fillColor:
                      selectedEvidence?.id === item.id
                        ? "rgb(251 191 36)"
                        : "rgb(59 130 246)",
                    fillOpacity: 0.75,
                    weight: selectedEvidence?.id === item.id ? 3 : 2,
                  }}
                  radius={selectedEvidence?.id === item.id ? 10 : 8}
                >
                  <Popup>
                    <div className="space-y-2 text-sm text-slate-800">
                      <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                        {item.type}
                      </div>
                      <div className="font-semibold text-slate-950">
                        {item.location || "Unknown location"}
                      </div>
                      <div>{item.people.join(", ") || "No linked people"}</div>
                      <div className="text-slate-500">{item.timestamp}</div>
                      <p className="text-slate-700">
                        {previewText(item.summary || item.content)}
                      </p>
                      <button
                        type="button"
                        onClick={() => onSelectEvidence(item.id)}
                        className="rounded-full bg-slate-950 px-3 py-1.5 text-xs font-medium text-white"
                      >
                        Open record
                      </button>
                    </div>
                  </Popup>
                </CircleMarker>
              ))}
            </MapContainer>
          </div>
        </div>
      ) : (
        <p className="mt-6 text-sm text-slate-500">
          No valid coordinates were found for the current evidence set.
        </p>
      )}
    </section>
  )
}
