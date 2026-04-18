import { useEffect, useMemo } from "react"
import {
  CircleMarker,
  MapContainer,
  Popup,
  TileLayer,
  Tooltip,
  useMap,
} from "react-leaflet"
import type { Evidence } from "../types/evidence"
import { getMappableEvidence } from "../utils/getMappableEvidence"

type MapViewProps = {
  evidence: Evidence[]
  selectedEvidence: Evidence | null
  variant?: "default" | "compact"
}

type MappedLocation = {
  key: string
  label: string
  order: number
  lat: number
  lng: number
  records: Evidence[]
}

const ANKARA_CENTER: [number, number] = [39.9334, 32.8597]
const DEFAULT_ZOOM = 12
const FOCUSED_ZOOM = 14

function previewText(value: string, maxLength = 120) {
  if (!value) {
    return "No additional context available."
  }

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

function buildMappedLocations(evidence: Evidence[]): {
  locations: MappedLocation[]
  routeSequence: number[]
} {
  const groupedLocations = new Map<string, MappedLocation>()
  const routeSequence: number[] = []

  for (const item of evidence) {
    if (!item.coordinatesPoint) {
      continue
    }

    const key = `${item.location}-${item.coordinatesPoint.lat}-${item.coordinatesPoint.lng}`
    const existingLocation = groupedLocations.get(key)

    if (existingLocation) {
      existingLocation.records.push(item)
      routeSequence.push(existingLocation.order)
      continue
    }

    const nextLocation: MappedLocation = {
      key,
      label: item.location || `Unknown stop ${groupedLocations.size + 1}`,
      order: groupedLocations.size + 1,
      lat: item.coordinatesPoint.lat,
      lng: item.coordinatesPoint.lng,
      records: [item],
    }

    groupedLocations.set(key, nextLocation)
    routeSequence.push(nextLocation.order)
  }

  return {
    locations: [...groupedLocations.values()],
    routeSequence,
  }
}

function compressRouteSequence(routeSequence: number[]) {
  return routeSequence.filter(
    (stop, index) => index === 0 || stop !== routeSequence[index - 1]
  )
}

export function MapView({
  evidence,
  selectedEvidence,
  variant = "default",
}: MapViewProps) {
  const mappableEvidence = useMemo(() => getMappableEvidence(evidence), [evidence])
  const { locations, routeSequence: rawRouteSequence } = useMemo(
    () => buildMappedLocations(mappableEvidence),
    [mappableEvidence]
  )
  const routeSequence = useMemo(
    () => compressRouteSequence(rawRouteSequence),
    [rawRouteSequence]
  )
  const mapHeightClass =
    variant === "compact"
      ? "h-[320px] md:h-[380px] xl:h-[420px]"
      : "aspect-video w-full"

  return (
    <section className="h-full rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
            Investigation map
          </p>
          <h2 className="mt-1 text-xl font-semibold text-jotform-navy">
            Numbered route locations across Ankara
          </h2>
        </div>
        <p className="text-sm text-slate-500">
          {locations.length} mapped locations
        </p>
      </div>

      {locations.length > 0 ? (
        <div className="mt-6 overflow-hidden rounded-[1.5rem] border border-slate-200">
          <div className={mapHeightClass}>
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

              {locations.map((location) => {
                const selectedLocationRecord =
                  location.records.find((record) => record.id === selectedEvidence?.id) ??
                  location.records[0]

                return (
                <CircleMarker
                  key={location.key}
                  center={[
                    location.lat,
                    location.lng,
                  ]}
                  pathOptions={{
                    color:
                      location.records.some((record) => record.id === selectedEvidence?.id)
                        ? "#FF6100"
                        : "#0A1551",
                    fillColor:
                      location.records.some((record) => record.id === selectedEvidence?.id)
                        ? "#FFB629"
                        : "#0099FF",
                    fillOpacity: 0.75,
                    weight: location.records.some((record) => record.id === selectedEvidence?.id)
                      ? 3
                      : 2,
                  }}
                  radius={
                    location.records.some((record) => record.id === selectedEvidence?.id)
                      ? 12
                      : 10
                  }
                >
                  <Tooltip
                    permanent
                    direction="center"
                    offset={[0, 0]}
                    className="map-stop-label"
                  >
                    {location.order}
                  </Tooltip>
                  <Popup>
                    <div className="space-y-2 text-sm text-slate-800">
                      <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                        stop {location.order}
                      </div>
                      <div className="font-semibold text-jotform-navy">
                        {location.label || "Unknown location"}
                      </div>
                      <div className="text-slate-500">
                        {location.records.length} route events
                      </div>
                      <div>
                        {selectedLocationRecord.people.join(", ") || "No people listed"}
                      </div>
                      <div className="text-slate-500">
                        {selectedLocationRecord.timestamp || "No timestamp"}
                      </div>
                      <p className="text-slate-700">
                        {previewText(
                          selectedLocationRecord.summary || selectedLocationRecord.content
                        )}
                      </p>
                    </div>
                  </Popup>
                </CircleMarker>
                )
              })}
            </MapContainer>
          </div>
        </div>
      ) : (
        <p className="mt-6 text-sm text-slate-500">
          No valid coordinates were found for the current evidence set.
        </p>
      )}

      {locations.length > 0 ? (
        <div className="mt-5 space-y-4">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Numbered locations
            </h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {locations.map((location) => (
                <div
                  key={location.key}
                  className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700"
                >
                  <span className="font-semibold text-slate-950">
                    {location.order}.
                  </span>{" "}
                  {location.label || "Unknown location"}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Route sequence
            </h3>
            <div className="mt-2 overflow-x-auto rounded-2xl border border-slate-200 bg-jotform-blue/5 px-4 py-4">
              <div className="flex min-w-max items-center gap-3">
                {routeSequence.map((stop, index) => (
                  <div key={`${stop}-${index}`} className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-jotform-navy bg-white text-lg font-semibold text-jotform-navy">
                      {stop}
                    </div>
                    {index < routeSequence.length - 1 ? (
                      <div className="flex items-center text-jotform-orange">
                        <svg
                          aria-hidden="true"
                          viewBox="0 0 24 24"
                          className="h-5 w-5 shrink-0"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M5 12h14" />
                          <path d="m13 5 7 7-7 7" />
                        </svg>
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  )
}
