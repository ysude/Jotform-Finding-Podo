type DashboardSummaryStripProps = {
  totalRecords: number
  visibleRecords: number
  uniquePeople: number
  uniqueLocations: number
  lastSightingTimestamp: string | null
}

const summaryItems = [
  { label: "Total records", key: "totalRecords" },
  { label: "Visible results", key: "visibleRecords" },
  { label: "Unique people", key: "uniquePeople" },
  { label: "Unique locations", key: "uniqueLocations" },
  { label: "Last sighting", key: "lastSightingTimestamp" },
] as const

export function DashboardSummaryStrip({
  totalRecords,
  visibleRecords,
  uniquePeople,
  uniqueLocations,
  lastSightingTimestamp,
}: DashboardSummaryStripProps) {
  const values = {
    totalRecords,
    visibleRecords,
    uniquePeople,
    uniqueLocations,
    lastSightingTimestamp: lastSightingTimestamp ?? "Unknown",
  }

  return (
    <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
      {summaryItems.map((item) => (
        <div
          key={item.key}
          className="rounded-[1.5rem] border border-slate-200 bg-white px-5 py-4 shadow-sm"
        >
          <div className="text-xs uppercase tracking-[0.18em] text-slate-500">
            {item.label}
          </div>
          <div className="mt-2 text-lg font-semibold text-jotform-navy">
            {values[item.key]}
          </div>
        </div>
      ))}
    </section>
  )
}
