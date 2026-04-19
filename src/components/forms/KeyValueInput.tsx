import { Plus, Trash2 } from 'lucide-react'

interface KeyValueInputProps {
  value: Record<string, string>
  onChange: (v: Record<string, string>) => void
  label?: string
  keyPlaceholder?: string
  valuePlaceholder?: string
}

export function KeyValueInput({ value, onChange, label = 'Fields', keyPlaceholder = 'Key', valuePlaceholder = 'Value' }: KeyValueInputProps) {
  const entries = Object.entries(value)

  const setEntry = (idx: number, k: string, v: string) => {
    const next = [...entries]
    next[idx] = [k, v]
    onChange(Object.fromEntries(next))
  }

  const addEntry = () => onChange({ ...value, '': '' })

  const removeEntry = (idx: number) => {
    const next = entries.filter((_, i) => i !== idx)
    onChange(Object.fromEntries(next))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-slate-400 uppercase tracking-wider">{label}</span>
        <button
          type="button"
          onClick={addEntry}
          className="flex items-center gap-1 text-xs text-accent hover:text-accentHover transition-colors"
        >
          <Plus size={11} /> Add
        </button>
      </div>
      <div className="space-y-1.5">
        {entries.map(([k, v], idx) => (
          <div key={idx} className="flex gap-1.5 items-center">
            <input
              className="flex-1 bg-canvas border border-border rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-accent"
              placeholder={keyPlaceholder}
              value={k}
              onChange={e => setEntry(idx, e.target.value, v)}
            />
            <input
              className="flex-1 bg-canvas border border-border rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-accent"
              placeholder={valuePlaceholder}
              value={v}
              onChange={e => setEntry(idx, k, e.target.value)}
            />
            <button
              type="button"
              onClick={() => removeEntry(idx)}
              className="text-slate-500 hover:text-danger transition-colors"
            >
              <Trash2 size={12} />
            </button>
          </div>
        ))}
        {entries.length === 0 && (
          <p className="text-xs text-slate-600 italic">No fields — click Add.</p>
        )}
      </div>
    </div>
  )
}
