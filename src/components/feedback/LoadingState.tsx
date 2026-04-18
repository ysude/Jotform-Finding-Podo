type LoadingStateProps = {
  message?: string
}

export function LoadingState({
  message = "Loading data...",
}: LoadingStateProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
      <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-jotform-blue" />
      <p className="mt-4 text-sm text-slate-600">{message}</p>
    </div>
  )
}
