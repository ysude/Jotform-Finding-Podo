type ErrorStateProps = {
  message: string
  onRetry?: () => void
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
      <div className="text-xs font-medium uppercase tracking-[0.18em] text-jotform-orange">
        Error
      </div>
      <h2 className="mt-2 text-lg font-semibold text-slate-900">
        Something went wrong while loading data.
      </h2>
      <p className="mt-2 text-sm text-slate-600">{message}</p>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 rounded-xl bg-jotform-navy px-4 py-2 text-sm font-medium text-white"
        >
          Retry
        </button>
      ) : null}
    </div>
  )
}
