import { useEffect, useMemo, useState } from "react"
import { CaseOverview } from "../components/CaseOverview"
import { EvidenceDetail } from "../components/EvidenceDetail"
import { EvidenceList } from "../components/EvidenceList"
import { Header } from "../components/Header"
import { StatePanel } from "../components/StatePanel"
import { Toolbar } from "../components/Toolbar"
import { useInvestigationData } from "../hooks/useInvestigationData"
import type { AppView, EvidenceFilters } from "../types/evidence"
import { getRelatedEvidence } from "../utils/getRelatedEvidence"
import { normalizeEvidence } from "../utils/normalizeEvidence"

const initialFilters: EvidenceFilters = {
  search: "",
  type: "all",
  person: "",
  location: "",
}

export default function App() {
  const [activeView, setActiveView] = useState<AppView>("overview")
  const [filters, setFilters] = useState<EvidenceFilters>(initialFilters)
  const [selectedEvidenceId, setSelectedEvidenceId] = useState<string | null>(null)
  const { data, error, isError, isLoading, isSuccess, retry } =
    useInvestigationData()

  const evidence = useMemo(
    () => (data ? normalizeEvidence(data) : []),
    [data]
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

    return evidence.filter((item) => {
      const matchesType = filters.type === "all" || item.type === filters.type
      const matchesPerson = !filters.person || item.people.includes(filters.person)
      const matchesLocation =
        !filters.location || item.location === filters.location

      if (!searchValue) {
        return matchesType && matchesPerson && matchesLocation
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
        searchableText.includes(searchValue)
      )
    })
  }, [evidence, filters])

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

  function openEvidenceDashboard(recordId: string) {
    setSelectedEvidenceId(recordId)
    setActiveView("dashboard")
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
          <StatePanel
            title="Loading records"
            message="Fetching investigation data and preparing evidence links."
          />
        ) : null}

        {isError && error ? (
          <StatePanel
            title="Could not load data"
            message={error}
            actionLabel="Try again"
            onAction={retry}
          />
        ) : null}

        {hasNoData ? (
          <StatePanel
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
                onOpenDashboard={openEvidenceDashboard}
              />
            ) : (
              <>
                <Toolbar
                  filters={filters}
                  people={people}
                  locations={locations}
                  onFiltersChange={setFilters}
                />

                {hasNoResults ? (
                  <StatePanel
                    title="No matching records"
                    message="Try clearing one or more filters to broaden the investigation."
                  />
                ) : (
                  <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(340px,0.9fr)]">
                    <EvidenceList
                      evidence={filteredEvidence}
                      selectedEvidenceId={selectedEvidenceId}
                      onSelectEvidence={setSelectedEvidenceId}
                    />

                    <EvidenceDetail
                      evidence={selectedEvidence}
                      relatedEvidence={relatedEvidence}
                      onPersonClick={(person) =>
                        setFilters((current) => ({ ...current, person }))
                      }
                      onRelatedEvidenceClick={setSelectedEvidenceId}
                    />
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
