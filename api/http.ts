type QueryValue = string | number | boolean | null | undefined

type FetchJsonOptions = {
  query?: Record<string, QueryValue>
  init?: RequestInit
}

function getHttpErrorMessage(status: number) {
  if (status === 404) {
    return "Resource not found"
  }

  if (status >= 500) {
    return "Server error"
  }

  return `Request failed (${status})`
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
  let response: Response

  try {
    response = await fetch(buildUrl(url, options.query), options.init)
  } catch (error) {
    console.error("Network error while fetching JSON", { url, error })
    throw new Error("Network error")
  }

  if (!response.ok) {
    let message = ""

    try {
      message = (await response.text()).trim()
    } catch (error) {
      console.warn("Could not read error response body", { url, error })
    }

    throw new Error(message || getHttpErrorMessage(response.status))
  }

  try {
    return (await response.json()) as T
  } catch (error) {
    console.error("Invalid JSON response", { url, error })
    throw new Error("Invalid server response")
  }
}
