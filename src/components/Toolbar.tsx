import type {
  EvidenceFilters,
  EvidenceQuickFilter,
  EvidenceSortOption,
  EvidenceType,
} from "../types/evidence"

type ToolbarProps = {
  filters: EvidenceFilters
  people: string[]
  locations: string[]
  onFiltersChange: (nextFilters: EvidenceFilters) => void
  onClearFilters: () => void
}

const typeOptions: Array<{ label: string; value: "all" | EvidenceType }> = [
  { label: "All types", value: "all" },
  { label: "Checkins", value: "checkin" },
  { label: "Messages", value: "message" },
  { label: "Sightings", value: "sighting" },
  { label: "Notes", value: "note" },
  { label: "Tips", value: "tip" },
]

const quickFilterOptions: Array<{
  label: string
  value: EvidenceQuickFilter
}> = [
  { label: "All records", value: "all" },
  { label: "Only Podo-related", value: "podoOnly" },
  { label: "Only messages", value: "messagesOnly" },
  { label: "Only sightings", value: "sightingsOnly" },
  { label: "High priority", value: "highPriority" },
]

const sortOptions: Array<{ label: string; value: EvidenceSortOption }> = [
  { label: "Newest first", value: "newest" },
  { label: "Oldest first", value: "oldest" },
  { label: "Most connected", value: "mostConnected" },
]

export function Toolbar({
  filters,
  people,
  locations,
  onFiltersChange,
  onClearFilters,
}: ToolbarProps) {
  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-1 pb-4">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
            Investigation controls
          </p>
          <h2 className="mt-1 text-lg font-semibold text-slate-950">
            Search, filter, and prioritize the evidence feed
          </h2>
        </div>

        <button
          type="button"
          onClick={onClearFilters}
          className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200"
        >
          Clear filters
        </button>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {quickFilterOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() =>
              onFiltersChange({ ...filters, quickFilter: option.value })
            }
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              filters.quickFilter === option.value
                ? "bg-slate-950 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
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

        <select
          value={filters.sortBy}
          onChange={(event) =>
            onFiltersChange({
              ...filters,
              sortBy: event.target.value as EvidenceFilters["sortBy"],
            })
          }
          className="rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </section>
  )
}
