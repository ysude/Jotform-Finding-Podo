type QueryValue = string | number | boolean | null | undefined

type FetchJsonOptions = {
  query?: Record<string, QueryValue>
  init?: RequestInit
}

function buildUrl(url: string, query?: Record<string, QueryValue>) {
  if (!query) {
    return url
  }

  const searchParams = new URLSearchParams()

  for (const [key, value] of Object.entries(query)) {
    if (value === null || value === undefined || value === "") {
      continue
    }

    searchParams.set(key, String(value))
  }

  const queryString = searchParams.toString()

  if (!queryString) {
    return url
  }

  return `${url}?${queryString}`
}

export async function fetchJson<T>(
  url: string,
  options: FetchJsonOptions = {}
): Promise<T> {
  const response = await fetch(buildUrl(url, options.query), options.init)

  if (!response.ok) {
    const message = await response.text()

    throw new Error(
      message || `Request failed with status ${response.status}`
    )
  }

  return response.json() as Promise<T>
}
