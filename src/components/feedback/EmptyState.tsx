type EmptyStateProps = {
  title: string
  message: string
  icon?: string
  actionLabel?: string
  onAction?: () => void
}

export function EmptyState({
  title,
  message,
  icon = "No data",
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
      <div className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
        {icon}
      </div>
      <h2 className="mt-2 text-lg font-semibold text-slate-900">{title}</h2>
      <p className="mt-2 text-sm text-slate-600">{message}</p>
      {actionLabel && onAction ? (
        <button
          type="button"
          onClick={onAction}
          className="mt-4 rounded-xl bg-jotform-navy px-4 py-2 text-sm font-medium text-white"
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  )
}
