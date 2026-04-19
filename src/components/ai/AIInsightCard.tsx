interface Props {
  title: string
  items: string[]
  color: 'danger' | 'accent' | 'success'
}

const colorMap = {
  danger: 'text-red-400 bg-danger/5 border-danger/20',
  accent: 'text-indigo-300 bg-accent/5 border-accent/20',
  success: 'text-green-400 bg-success/5 border-success/20',
}

export function AIInsightCard({ title, items, color }: Props) {
  if (items.length === 0) return null
  return (
    <div className={`rounded-lg border p-3 ${colorMap[color]}`}>
      <p className="text-xs font-semibold uppercase tracking-wider mb-2 opacity-80">{title}</p>
      <ul className="space-y-1.5">
        {items.map((item, i) => (
          <li key={i} className="text-xs leading-relaxed">• {item}</li>
        ))}
      </ul>
    </div>
  )
}
