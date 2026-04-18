import type { AppView } from "../types/evidence"

type HeaderProps = {
  activeView: AppView
  recordCount: number
  onViewChange: (view: AppView) => void
}

const navItems: Array<{ label: string; value: AppView }> = [
  { label: "Route Overview", value: "overview" },
  { label: "Evidence Dashboard", value: "dashboard" },
]

export function Header({ activeView, recordCount, onViewChange }: HeaderProps) {
  return (
    <header className="rounded-[2rem] border border-slate-200 bg-white/90 p-6 shadow-sm backdrop-blur">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.28em] text-amber-700">
            Missing Podo
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
            Ankara Investigation Console
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-600">
            Follow Podo&apos;s route, inspect the latest linked evidence, and
            move between high-level timeline view and raw evidence review.
          </p>
        </div>

        <div className="rounded-2xl bg-slate-100 px-4 py-3 text-right">
          <div className="text-xs uppercase tracking-[0.18em] text-slate-500">
            Active records
          </div>
          <div className="mt-1 text-2xl font-semibold text-slate-950">
            {recordCount}
          </div>
        </div>
      </div>

      <nav className="mt-6 flex flex-wrap gap-3">
        {navItems.map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => onViewChange(item.value)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              activeView === item.value
                ? "bg-slate-950 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </header>
  )
}
