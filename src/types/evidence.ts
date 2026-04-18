export type EvidenceType = "checkin" | "message" | "sighting" | "note" | "tip"
export type AppView = "overview" | "dashboard"
export type RelatedReason = "samePerson" | "sameLocation" | "sameTimeWindow"
export type EvidenceQuickFilter =
  | "all"
  | "podoOnly"
  | "messagesOnly"
  | "sightingsOnly"
  | "highPriority"
export type EvidenceSortOption = "newest" | "oldest" | "mostConnected"

export type CoordinatePoint = {
  lat: number
  lng: number
}

export type Evidence = {
  id: string
  type: EvidenceType
  title: string
  people: string[]
  location: string
  coordinates?: string
  coordinatesPoint?: CoordinatePoint
  timestamp: string
  timestampMs: number | null
  sortOrder: number
  summary: string
  content: string
  urgency?: string
  confidence?: string
  rawSubmissionId: string
}

export type RelatedEvidenceItem = {
  evidence: Evidence
  reasons: RelatedReason[]
  sharedPeople: string[]
}

export type RawAnswer = {
  name?: string
  answer?: string
}

export type RawSubmission = {
  id: string
  answers?: Record<string, RawAnswer>
}

export type RawInvestigationData = {
  checkins: RawSubmission[]
  messages: RawSubmission[]
  sightings: RawSubmission[]
  notes: RawSubmission[]
  tips: RawSubmission[]
}

export type DataStatus = "idle" | "loading" | "success" | "error"

export type EvidenceFilters = {
  search: string
  type: "all" | EvidenceType
  person: string
  location: string
  quickFilter: EvidenceQuickFilter
  sortBy: EvidenceSortOption
}
