type StatePanelProps = {
  title: string
  message: string
  actionLabel?: string
  onAction?: () => void
}

export function StatePanel({
  title,
  message,
  actionLabel,
  onAction,
}: StatePanelProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      <p className="mt-2 text-sm text-slate-600">{message}</p>
      {actionLabel && onAction ? (
        <button
          type="button"
          onClick={onAction}
          className="mt-4 rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white"
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  )
}
