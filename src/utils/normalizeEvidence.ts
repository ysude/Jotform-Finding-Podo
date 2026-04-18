import type { Evidence, RawInvestigationData, RawSubmission } from "../types/evidence"
import { extractAnswer } from "./extractAnswer"
import { normalizeName } from "./normalizeName"

function splitPeople(value: string): string[] {
  return value
    .split(",")
    .map((item) => normalizeName(item))
    .filter(Boolean)
}

function buildBaseRecord(
  submission: RawSubmission,
  type: Evidence["type"]
): Omit<Evidence, "title" | "people" | "summary" | "content"> {
  return {
    id: `${type}:${submission.id}`,
    type,
    location: extractAnswer(submission, "location"),
    coordinates: extractAnswer(submission, "coordinates") || undefined,
    timestamp: extractAnswer(submission, "timestamp"),
    rawSubmissionId: submission.id,
    urgency: undefined,
    confidence: undefined,
  }
}

export function normalizeEvidence(data: RawInvestigationData): Evidence[] {
  const checkins = data.checkins.map((submission) => {
    const person = normalizeName(extractAnswer(submission, "personName"))
    const note = extractAnswer(submission, "note")

    return {
      ...buildBaseRecord(submission, "checkin"),
      title: `${person} checked in`,
      people: [person],
      summary: note || "Check-in record",
      content: note || "No additional note.",
    }
  })

  const messages = data.messages.map((submission) => {
    const sender = normalizeName(extractAnswer(submission, "senderName"))
    const recipient = normalizeName(extractAnswer(submission, "recipientName"))
    const text = extractAnswer(submission, "text")
    const urgency = extractAnswer(submission, "urgency")

    return {
      ...buildBaseRecord(submission, "message"),
      title: `${sender} -> ${recipient}`,
      people: [sender, recipient].filter(Boolean),
      summary: text,
      content: text || "No message text.",
      urgency: urgency || undefined,
    }
  })

  const sightings = data.sightings.map((submission) => {
    const person = normalizeName(extractAnswer(submission, "personName"))
    const seenWith = normalizeName(extractAnswer(submission, "seenWith"))
    const note = extractAnswer(submission, "note")

    return {
      ...buildBaseRecord(submission, "sighting"),
      title: `${person} seen with ${seenWith}`,
      people: [person, seenWith].filter(Boolean),
      summary: note || "Sighting record",
      content: note || "No additional note.",
    }
  })

  const notes = data.notes.map((submission) => {
    const author = normalizeName(extractAnswer(submission, "authorName"))
    const note = extractAnswer(submission, "note")
    const mentionedPeople = splitPeople(extractAnswer(submission, "mentionedPeople"))

    return {
      ...buildBaseRecord(submission, "note"),
      title: `${author}'s note`,
      people: [author, ...mentionedPeople].filter(Boolean),
      summary: note,
      content: note || "No note content.",
    }
  })

  const tips = data.tips.map((submission) => {
    const suspect = normalizeName(extractAnswer(submission, "suspectName"))
    const tip = extractAnswer(submission, "tip")
    const confidence = extractAnswer(submission, "confidence")

    return {
      ...buildBaseRecord(submission, "tip"),
      title: suspect ? `Tip about ${suspect}` : "Anonymous tip",
      people: suspect ? [suspect] : [],
      summary: tip,
      content: tip || "No tip content.",
      confidence: confidence || undefined,
    }
  })

  return [...checkins, ...messages, ...sightings, ...notes, ...tips].sort(
    (left, right) => left.timestamp.localeCompare(right.timestamp)
  )
}
