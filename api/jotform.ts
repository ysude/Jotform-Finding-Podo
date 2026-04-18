import { fetchJson } from "./http"
import { jotformConfig } from "./jotform.config.local"

const JOTFORM_API_BASE_URL = "https://api.jotform.com"

export type JotformSubmission = {
  id: string
  [key: string]: unknown
}

type JotformResponse<T> = {
  content: T
  message?: string
  responseCode?: number
}

export type InvestigationFormKey =
  | "checkins"
  | "messages"
  | "sightings"
  | "notes"
  | "tips"

export type InvestigationFormIds = Record<InvestigationFormKey, string>

export type JotformConfig = {
  apiKey: string
  formIds: InvestigationFormIds
}

export async function fetchFormSubmissions(
  formId: string,
  apiKey = jotformConfig.apiKey
): Promise<JotformSubmission[]> {
  const response = await fetchJson<JotformResponse<JotformSubmission[]>>(
    `${JOTFORM_API_BASE_URL}/form/${formId}/submissions`,
    {
      query: {
        apiKey,
      },
    }
  )

  return response.content ?? []
}

export async function fetchInvestigationForms(
  config: JotformConfig = jotformConfig
): Promise<Record<InvestigationFormKey, JotformSubmission[]>> {
  const entries = Object.entries(config.formIds) as [
    InvestigationFormKey,
    string,
  ][]

  const results = await Promise.all(
    entries.map(async ([key, formId]) => {
      const submissions = await fetchFormSubmissions(formId, config.apiKey)

      return [key, submissions] as const
    })
  )

  return Object.fromEntries(results) as Record<
    InvestigationFormKey,
    JotformSubmission[]
  >
}

export { jotformConfig }
