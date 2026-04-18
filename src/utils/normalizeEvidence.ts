import type { Evidence, RawInvestigationData, RawSubmission } from "../types/evidence"
import { extractAnswer } from "./extractAnswer"
import { normalizeName } from "./normalizeName"
import { parseCoordinates } from "./parseCoordinates"
import { parseTimestamp } from "./parseTimestamp"

const FALLBACK_LOCATION = "Unknown location"
const FALLBACK_TIMESTAMP = "No timestamp"

function splitPeople(value: string): string[] {
  return value
    .split(",")
    .map((item) => normalizeName(item))
    .filter(Boolean)
}

function safeSubmissionList(
  value: RawSubmission[] | undefined,
  key: keyof RawInvestigationData
) {
  if (Array.isArray(value)) {
    return value
  }

  console.warn(`Expected an array for ${key}, received`, value)
  return []
}

function cleanPeople(people: string[]) {
  return [...new Set(people.filter(Boolean))]
}

function buildBaseRecord(
  submission: RawSubmission,
  type: Evidence["type"],
  sortOrder: number
): Omit<Evidence, "title" | "people" | "summary" | "content"> {
  const coordinates = extractAnswer(submission, "coordinates")
  const timestamp = extractAnswer(submission, "timestamp")
  const location = extractAnswer(submission, "location")

  return {
    id: `${type}:${submission.id || `unknown-${sortOrder}`}`,
    type,
    location: location || FALLBACK_LOCATION,
    coordinates: coordinates || undefined,
    coordinatesPoint: parseCoordinates(coordinates),
    timestamp: timestamp || FALLBACK_TIMESTAMP,
    timestampMs: parseTimestamp(timestamp),
    sortOrder,
    rawSubmissionId: submission.id || `unknown-${sortOrder}`,
    urgency: undefined,
    confidence: undefined,
  }
}

export function normalizeEvidence(data: RawInvestigationData): Evidence[] {
  let sortOrder = 0

  const checkins = safeSubmissionList(data.checkins, "checkins").map((submission) => {
    const person = normalizeName(extractAnswer(submission, "personName"))
    const note = extractAnswer(submission, "note")

    return {
      ...buildBaseRecord(submission, "checkin", sortOrder++),
      title: person ? `${person} checked in` : "Unknown person checked in",
      people: cleanPeople([person]),
      summary: note || "Check-in record",
      content: note || "No additional note.",
    }
  })

  const messages = safeSubmissionList(data.messages, "messages").map((submission) => {
    const sender = normalizeName(extractAnswer(submission, "senderName"))
    const recipient = normalizeName(extractAnswer(submission, "recipientName"))
    const text = extractAnswer(submission, "text")
    const urgency = extractAnswer(submission, "urgency")
    const title =
      sender && recipient
        ? `${sender} -> ${recipient}`
        : sender || recipient
          ? `${sender || recipient} message`
          : "Unknown message"

    return {
      ...buildBaseRecord(submission, "message", sortOrder++),
      title,
      people: cleanPeople([sender, recipient]),
      summary: text || "No message preview.",
      content: text || "No message text.",
      urgency: urgency ? urgency.toLowerCase() : undefined,
    }
  })

  const sightings = safeSubmissionList(data.sightings, "sightings").map((submission) => {
    const person = normalizeName(extractAnswer(submission, "personName"))
    const seenWith = normalizeName(extractAnswer(submission, "seenWith"))
    const note = extractAnswer(submission, "note")
    const title =
      person && seenWith
        ? `${person} seen with ${seenWith}`
        : person
          ? `${person} sighting`
          : "Unknown sighting"

    return {
      ...buildBaseRecord(submission, "sighting", sortOrder++),
      title,
      people: cleanPeople([person, seenWith]),
      summary: note || "Sighting record",
      content: note || "No additional note.",
    }
  })

  const notes = safeSubmissionList(data.notes, "notes").map((submission) => {
    const author = normalizeName(extractAnswer(submission, "authorName"))
    const note = extractAnswer(submission, "note")
    const mentionedPeople = splitPeople(extractAnswer(submission, "mentionedPeople"))

    return {
      ...buildBaseRecord(submission, "note", sortOrder++),
      title: author ? `${author}'s note` : "Unattributed note",
      people: cleanPeople([author, ...mentionedPeople]),
      summary: note || "No note preview.",
      content: note || "No note content.",
    }
  })

  const tips = safeSubmissionList(data.tips, "tips").map((submission) => {
    const suspect = normalizeName(extractAnswer(submission, "suspectName"))
    const tip = extractAnswer(submission, "tip")
    const confidence = extractAnswer(submission, "confidence")

    return {
      ...buildBaseRecord(submission, "tip", sortOrder++),
      title: suspect ? `Tip about ${suspect}` : "Anonymous tip",
      people: cleanPeople(suspect ? [suspect] : []),
      summary: tip || "No tip preview.",
      content: tip || "No tip content.",
      confidence: confidence ? confidence.toLowerCase() : undefined,
    }
  })

  return [...checkins, ...messages, ...sightings, ...notes, ...tips].sort(
    (left, right) => {
      if (left.timestampMs !== null && right.timestampMs !== null) {
        return left.timestampMs - right.timestampMs || left.sortOrder - right.sortOrder
      }

      if (left.timestampMs !== null) {
        return -1
      }

      if (right.timestampMs !== null) {
        return 1
      }

      return left.sortOrder - right.sortOrder
    }
  )
}
