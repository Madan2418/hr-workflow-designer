import { CheckCircle2, Clock, XCircle, SkipForward, Timer } from 'lucide-react'
import type { SimulationStep } from '../../types/workflow'

const statusConfig: Record<SimulationStep['status'], { icon: React.ReactNode; color: string; label: string }> = {
  completed: { icon: <CheckCircle2 size={14} />, color: 'text-success', label: 'Completed' },
  pending: { icon: <Clock size={14} />, color: 'text-warning', label: 'Pending' },
  error: { icon: <XCircle size={14} />, color: 'text-danger', label: 'Error' },
  skipped: { icon: <SkipForward size={14} />, color: 'text-slate-500', label: 'Skipped' },
}

export function ExecutionLog({ steps }: { steps: SimulationStep[] }) {
  return (
    <div className="space-y-2">
      {steps.map((step, i) => {
        const cfg = statusConfig[step.status]
        return (
          <div key={step.nodeId} className={`flex items-start gap-3 p-3 rounded-lg border ${
            step.status === 'pending' ? 'border-warning/30 bg-warning/5' :
            step.status === 'completed' ? 'border-success/20 bg-success/5' :
            step.status === 'error' ? 'border-danger/30 bg-danger/5' :
            'border-border bg-surface/50'
          }`}>
            <div className="flex flex-col items-center gap-1 pt-0.5">
              <span className="text-xs text-slate-600">{i + 1}</span>
              <div className={cfg.color}>{cfg.icon}</div>
              {i < steps.length - 1 && <div className="w-px h-4 bg-border" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium text-white truncate">{step.label}</p>
                <span className={`text-xs font-medium ${cfg.color} shrink-0`}>{cfg.label}</span>
              </div>
              <p className="text-xs text-slate-500 capitalize">{step.type}</p>
              {step.detail && <p className="text-xs text-slate-400 mt-1 italic">{step.detail}</p>}
              {step.duration !== null && step.duration > 0 && (
                <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                  <Timer size={10} /> {step.duration}s
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
