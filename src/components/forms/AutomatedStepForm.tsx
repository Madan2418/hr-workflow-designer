import { useEffect, useState } from 'react'
import { useWorkflowStore } from '../../hooks/useWorkflowStore'
import { getAutomations } from '../../api/automations'
import { NodeType } from '../../types/nodes'
import type { AutomatedStepNodeData } from '../../types/nodes'
import type { AutomationAction } from '../../types/api'
import { Loader2 } from 'lucide-react'

interface Props { nodeId: string; data: AutomatedStepNodeData }

export function AutomatedStepForm({ nodeId, data }: Props) {
  const update = useWorkflowStore((s) => s.updateNodeData)
  const patch = (partial: Partial<AutomatedStepNodeData>) =>
    update(nodeId, { type: NodeType.AutomatedStep, ...partial })

  const [actions, setActions] = useState<AutomationAction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAutomations().then(a => { setActions(a); setLoading(false) })
  }, [])

  const selectedAction = actions.find(a => a.id === data.actionId)

  return (
    <div className="space-y-4">
      <div>
        <label className="form-label">Title</label>
        <input className="form-input" value={data.label} onChange={e => patch({ label: e.target.value })} />
      </div>
      <div>
        <label className="form-label">Action</label>
        {loading ? (
          <div className="flex items-center gap-2 text-slate-400 text-sm">
            <Loader2 size={14} className="animate-spin" /> Loading actions…
          </div>
        ) : (
          <select
            className="form-input"
            value={data.actionId}
            onChange={e => patch({ actionId: e.target.value, actionParams: {} })}
          >
            <option value="">— Select an action —</option>
            {actions.map(a => <option key={a.id} value={a.id}>{a.label}</option>)}
          </select>
        )}
      </div>

      {selectedAction && selectedAction.params.length > 0 && (
        <div>
          <label className="form-label">Parameters</label>
          <div className="space-y-2">
            {selectedAction.params.map(param => (
              <div key={param} className="flex items-center gap-2">
                <span className="text-xs text-slate-400 w-20 shrink-0">{param}</span>
                <input
                  className="form-input flex-1"
                  placeholder={param}
                  value={data.actionParams[param] ?? ''}
                  onChange={e => patch({
                    actionParams: { ...data.actionParams, [param]: e.target.value }
                  })}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
