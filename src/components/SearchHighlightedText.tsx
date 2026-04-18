type SearchHighlightedTextProps = {
  text: string
  query: string
  className?: string
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

export function SearchHighlightedText({
  text,
  query,
  className,
}: SearchHighlightedTextProps) {
  const trimmedQuery = query.trim()

  if (!trimmedQuery) {
    return <span className={className}>{text}</span>
  }

  const pattern = new RegExp(`(${escapeRegExp(trimmedQuery)})`, "gi")
  const parts = text.split(pattern)

  return (
    <span className={className}>
      {parts.map((part, index) =>
        part.toLocaleLowerCase().includes(trimmedQuery.toLocaleLowerCase()) ? (
          <mark
            key={`${part}-${index}`}
            className="rounded bg-jotform-yellow/50 px-0.5 text-inherit"
          >
            {part}
          </mark>
        ) : (
          <span key={`${part}-${index}`}>{part}</span>
        )
      )}
    </span>
  )
}
