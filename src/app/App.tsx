import { useEffect, useMemo, useState } from "react"
import { CaseOverview } from "../components/CaseOverview"
import { ContextTimeline } from "../components/ContextTimeline"
import { DashboardSummaryStrip } from "../components/DashboardSummaryStrip"
import { EvidenceDetail } from "../components/EvidenceDetail"
import { EvidenceList } from "../components/EvidenceList"
import { EmptyState } from "../components/feedback/EmptyState"
import { ErrorState } from "../components/feedback/ErrorState"
import { LoadingState } from "../components/feedback/LoadingState"
import { Header } from "../components/Header"
import { Toolbar } from "../components/Toolbar"
import { useInvestigationData } from "../hooks/useInvestigationData"
import type { AppView, EvidenceFilters } from "../types/evidence"
import { getRelatedEvidence } from "../utils/getRelatedEvidence"
import { normalizeEvidence } from "../utils/normalizeEvidence"

const LIST_PAGE_SIZE = 8
const SAME_TIME_WINDOW_MS = 45 * 60 * 1000

const initialFilters: EvidenceFilters = {
  search: "",
  type: "all",
  person: "",
  location: "",
  quickFilter: "all",
  sortBy: "oldest",
}

export default function App() {
  const [activeView, setActiveView] = useState<AppView>("overview")
  const [filters, setFilters] = useState<EvidenceFilters>(initialFilters)
  const [selectedEvidenceId, setSelectedEvidenceId] = useState<string | null>(null)
  const [visibleEvidenceCount, setVisibleEvidenceCount] = useState(LIST_PAGE_SIZE)
  const { data, error, isError, isLoading, isSuccess, retry } =
    useInvestigationData()

  const evidence = useMemo(
    () => (data ? normalizeEvidence(data) : []),
    [data]
  )

  const connectionCounts = useMemo(
    () =>
      new Map(
        evidence.map((item) => [item.id, getRelatedEvidence(item, evidence).length])
      ),
    [evidence]
  )

  useEffect(() => {
    if (!evidence.length) {
      setSelectedEvidenceId(null)
      return
    }

    setSelectedEvidenceId((current) => current ?? evidence[0].id)
  }, [evidence])

  const people = useMemo(
    () =>
      [...new Set(evidence.flatMap((item) => item.people))]
        .filter(Boolean)
        .sort((left, right) => left.localeCompare(right)),
    [evidence]
  )

  const locations = useMemo(
    () =>
      [...new Set(evidence.map((item) => item.location))]
        .filter(Boolean)
        .sort((left, right) => left.localeCompare(right)),
    [evidence]
  )

  const filteredEvidence = useMemo(() => {
    const searchValue = filters.search.trim().toLocaleLowerCase("tr-TR")
    const visibleEvidence = evidence.filter((item) => {
      const matchesType = filters.type === "all" || item.type === filters.type
      const matchesPerson = !filters.person || item.people.includes(filters.person)
      const matchesLocation =
        !filters.location || item.location === filters.location
      const matchesQuickFilter =
        filters.quickFilter === "all" ||
        (filters.quickFilter === "podoOnly" && item.people.includes("Podo")) ||
        (filters.quickFilter === "messagesOnly" && item.type === "message") ||
        (filters.quickFilter === "sightingsOnly" && item.type === "sighting") ||
        (filters.quickFilter === "highPriority" &&
          (item.urgency === "high" || item.confidence === "high"))

      if (!searchValue) {
        return (
          matchesType &&
          matchesPerson &&
          matchesLocation &&
          matchesQuickFilter
        )
      }

      const searchableText = [
        item.title,
        item.summary,
        item.content,
        item.location,
        ...item.people,
      ]
        .join(" ")
        .toLocaleLowerCase("tr-TR")

      return (
        matchesType &&
        matchesPerson &&
        matchesLocation &&
        matchesQuickFilter &&
        searchableText.includes(searchValue)
      )
    })

    return [...visibleEvidence].sort((left, right) => {
      if (filters.sortBy === "oldest") {
        return left.sortOrder - right.sortOrder
      }

      if (filters.sortBy === "mostConnected") {
        const connectionDelta =
          (connectionCounts.get(right.id) ?? 0) - (connectionCounts.get(left.id) ?? 0)

        if (connectionDelta !== 0) {
          return connectionDelta
        }
      }

      const leftTimestamp = left.timestampMs ?? Number.MIN_SAFE_INTEGER
      const rightTimestamp = right.timestampMs ?? Number.MIN_SAFE_INTEGER

      if (rightTimestamp !== leftTimestamp) {
        return rightTimestamp - leftTimestamp
      }

      return right.sortOrder - left.sortOrder
    })
  }, [connectionCounts, evidence, filters])

  useEffect(() => {
    setVisibleEvidenceCount(LIST_PAGE_SIZE)
  }, [filters, activeView])

  useEffect(() => {
    if (!selectedEvidenceId) return

    const isStillInList = filteredEvidence.some(
      (item) => item.id === selectedEvidenceId
    )

    if (!isStillInList) {
      setSelectedEvidenceId(filteredEvidence[0]?.id ?? null)
    }
  }, [filteredEvidence, selectedEvidenceId])

  const selectedEvidence =
    filteredEvidence.find((item) => item.id === selectedEvidenceId) ??
    evidence.find((item) => item.id === selectedEvidenceId) ??
    null

  const relatedEvidence = useMemo(() => {
    if (!selectedEvidence) {
      return []
    }

    return getRelatedEvidence(selectedEvidence, evidence)
  }, [evidence, selectedEvidence])

  const contextTimeline = useMemo(() => {
    if (!selectedEvidence || selectedEvidence.timestampMs === null) {
      return []
    }

    return evidence.filter(
      (item) =>
        item.id !== selectedEvidence.id &&
        item.timestampMs !== null &&
        Math.abs(item.timestampMs - (selectedEvidence.timestampMs as number)) <=
          SAME_TIME_WINDOW_MS
    )
  }, [evidence, selectedEvidence])

  const podoRoute = useMemo(
    () => evidence.filter((item) => item.people.includes("Podo")),
    [evidence]
  )

  const lastPodoSighting = useMemo(
    () =>
      [...podoRoute].filter((item) => item.type === "sighting").slice(-1)[0] ??
      null,
    [podoRoute]
  )

  const focusPerson =
    lastPodoSighting?.people.find((person: string) => person !== "Podo") ?? null

  const focusPersonMessages = useMemo(() => {
    if (!focusPerson) {
      return []
    }

    return [...evidence]
      .filter(
        (item) => item.type === "message" && item.people.includes(focusPerson)
      )
      .slice(-4)
      .reverse()
  }, [evidence, focusPerson])

  const hasNoData = isSuccess && evidence.length === 0
  const hasNoResults =
    isSuccess && evidence.length > 0 && filteredEvidence.length === 0

  const uniquePeopleCount = useMemo(
    () => [...new Set(evidence.flatMap((item) => item.people))].filter(Boolean).length,
    [evidence]
  )

  const uniqueLocationCount = useMemo(
    () => [...new Set(evidence.map((item) => item.location))].filter(Boolean).length,
    [evidence]
  )

  const visibleEvidence = filteredEvidence.slice(0, visibleEvidenceCount)
  const hasMoreEvidence = visibleEvidenceCount < filteredEvidence.length

  function openEvidenceDashboard(recordId: string) {
    setSelectedEvidenceId(recordId)
    setActiveView("dashboard")
  }

  function clearFilters() {
    setFilters(initialFilters)
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_#fff8eb_0%,_#f8fafc_28%,_#eef2ff_100%)] text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Header
          activeView={activeView}
          recordCount={evidence.length}
          onViewChange={setActiveView}
        />

        {isLoading ? (
          <LoadingState message="Loading data..." />
        ) : null}

        {isError && error ? (
          <ErrorState
            message={error || "Failed to load investigation data."}
            onRetry={retry}
          />
        ) : null}

        {hasNoData ? (
          <EmptyState
            title="No records found"
            message="The dataset loaded successfully but does not contain any evidence."
          />
        ) : null}

        {isSuccess && !hasNoData ? (
          <div className="space-y-6">
            {activeView === "overview" ? (
              <CaseOverview
                focusPerson={focusPerson}
                focusPersonMessages={focusPersonMessages}
                lastSighting={lastPodoSighting}
                routeEvidence={podoRoute}
                selectedEvidence={selectedEvidence}
                onOpenDashboard={openEvidenceDashboard}
              />
            ) : (
              <>
                <DashboardSummaryStrip
                  totalRecords={evidence.length}
                  visibleRecords={filteredEvidence.length}
                  uniquePeople={uniquePeopleCount}
                  uniqueLocations={uniqueLocationCount}
                  lastSightingTimestamp={lastPodoSighting?.timestamp ?? null}
                />

                <Toolbar
                  filters={filters}
                  people={people}
                  locations={locations}
                  onFiltersChange={setFilters}
                  onClearFilters={clearFilters}
                />

                {hasNoResults ? (
                  <EmptyState
                    title="No matching records"
                    message="Try clearing one or more filters to broaden the investigation."
                    icon="No results"
                    actionLabel="Clear filters"
                    onAction={clearFilters}
                  />
                ) : (
                  <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)]">
                    <EvidenceList
                      evidence={visibleEvidence}
                      selectedEvidenceId={selectedEvidenceId}
                      onSelectEvidence={setSelectedEvidenceId}
                      searchQuery={filters.search}
                      hasMore={hasMoreEvidence}
                      onLoadMore={() =>
                        setVisibleEvidenceCount((current) => current + LIST_PAGE_SIZE)
                      }
                      totalCount={filteredEvidence.length}
                    />

                    <div className="space-y-6">
                      <EvidenceDetail
                        evidence={selectedEvidence}
                        relatedEvidence={relatedEvidence}
                        onPersonClick={(person) =>
                          setFilters((current) => ({ ...current, person }))
                        }
                        onRelatedEvidenceClick={setSelectedEvidenceId}
                      />

                      <ContextTimeline
                        evidence={contextTimeline}
                        onOpenEvidence={setSelectedEvidenceId}
                      />
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        ) : null}
      </div>
    </main>
  )
}
