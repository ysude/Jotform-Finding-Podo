import type { EvidenceFilters, EvidenceType } from "../types/evidence"

type ToolbarProps = {
  filters: EvidenceFilters
  people: string[]
  locations: string[]
  onFiltersChange: (nextFilters: EvidenceFilters) => void
}

const typeOptions: Array<{ label: string; value: "all" | EvidenceType }> = [
  { label: "All types", value: "all" },
  { label: "Checkins", value: "checkin" },
  { label: "Messages", value: "message" },
  { label: "Sightings", value: "sighting" },
  { label: "Notes", value: "note" },
  { label: "Tips", value: "tip" },
]

export function Toolbar({
  filters,
  people,
  locations,
  onFiltersChange,
}: ToolbarProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <input
          value={filters.search}
          onChange={(event) =>
            onFiltersChange({ ...filters, search: event.target.value })
          }
          className="rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none ring-0 placeholder:text-slate-400"
          placeholder="Search people, location, or text"
        />

        <select
          value={filters.type}
          onChange={(event) =>
            onFiltersChange({
              ...filters,
              type: event.target.value as EvidenceFilters["type"],
            })
          }
          className="rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900"
        >
          {typeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <select
          value={filters.person}
          onChange={(event) =>
            onFiltersChange({ ...filters, person: event.target.value })
          }
          className="rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900"
        >
          <option value="">All people</option>
          {people.map((person) => (
            <option key={person} value={person}>
              {person}
            </option>
          ))}
        </select>

        <select
          value={filters.location}
          onChange={(event) =>
            onFiltersChange({ ...filters, location: event.target.value })
          }
          className="rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900"
        >
          <option value="">All locations</option>
          {locations.map((location) => (
            <option key={location} value={location}>
              {location}
            </option>
          ))}
        </select>
      </div>
    </section>
  )
}
