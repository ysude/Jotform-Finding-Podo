import type { RawSubmission } from "../types/evidence"

export function extractAnswer(
  submission: RawSubmission,
  fieldName: string
): string {
  const answers = Object.values(submission.answers ?? {})
  const match = answers.find((answer) => answer.name === fieldName)

  return typeof match?.answer === "string" ? match.answer.trim() : ""
}
