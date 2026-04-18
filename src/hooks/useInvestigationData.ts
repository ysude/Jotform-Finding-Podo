import { useCallback, useEffect, useState } from "react"
import type { DataStatus, RawInvestigationData } from "../types/evidence"
import { fetchInvestigationData } from "../data/fetchInvestigationData"

type InvestigationDataState = {
  data: RawInvestigationData | null
  error: string | null
  status: DataStatus
}

const initialState: InvestigationDataState = {
  data: null,
  error: null,
  status: "idle",
}

export function useInvestigationData() {
  const [state, setState] = useState<InvestigationDataState>(initialState)

  const load = useCallback(async () => {
    try {
      setState((current) => ({
        data: current.data,
        error: null,
        status: "loading",
      }))

      const data = await fetchInvestigationData()

      setState({
        data,
        error: null,
        status: "success",
      })
    } catch (error) {
      setState({
        data: null,
        error:
          error instanceof Error
            ? error.message
            : "Failed to load investigation data",
        status: "error",
      })
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  return {
    data: state.data,
    error: state.error,
    isError: state.status === "error",
    isLoading: state.status === "loading" || state.status === "idle",
    isSuccess: state.status === "success",
    retry: load,
    status: state.status,
  }
}
