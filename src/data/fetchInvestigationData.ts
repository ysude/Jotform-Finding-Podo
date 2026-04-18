import type { RawInvestigationData } from "../types/evidence"

export async function fetchInvestigationData(): Promise<RawInvestigationData> {
  const response = await fetch("/jotform-data.json")

  if (!response.ok) {
    throw new Error(`Failed to load investigation data (${response.status})`)
  }

  return response.json() as Promise<RawInvestigationData>
}
