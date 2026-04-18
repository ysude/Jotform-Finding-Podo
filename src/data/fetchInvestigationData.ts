import { fetchJson } from "../../api/http"
import type { RawInvestigationData } from "../types/evidence"

export async function fetchInvestigationData(): Promise<RawInvestigationData> {
  const data = await fetchJson<RawInvestigationData>("/jotform-data.json")

  if (!data || typeof data !== "object") {
    console.error("Unexpected investigation dataset structure", data)
    throw new Error("Invalid data format received.")
  }

  return data
}
