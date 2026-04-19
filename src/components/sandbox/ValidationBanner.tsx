import { AlertTriangle, XCircle } from 'lucide-react'
import type { ValidationError } from '../../types/workflow'

export function ValidationBanner({ errors }: { errors: ValidationError[] }) {
  if (errors.length === 0) return null

  const hasErrors = errors.some(e => e.severity === 'error')

  return (
    <div className={`rounded-lg border p-3 mb-3 ${
      hasErrors ? 'border-danger/40 bg-danger/5' : 'border-warning/40 bg-warning/5'
    }`}>
      <div className="flex items-center gap-2 mb-2">
        {hasErrors
          ? <XCircle size={14} className="text-danger" />
          : <AlertTriangle size={14} className="text-warning" />
        }
        <span className="text-xs font-semibold text-white">
          {hasErrors ? 'Validation Errors' : 'Warnings'}
        </span>
      </div>
      <ul className="space-y-1">
        {errors.map((e, i) => (
          <li key={i} className={`text-xs ${e.severity === 'error' ? 'text-red-300' : 'text-amber-300'}`}>
            • {e.message}
          </li>
        ))}
      </ul>
    </div>
  )
}
