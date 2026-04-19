import { useWorkflowStore } from '../../hooks/useWorkflowStore'
import { NodeType } from '../../types/nodes'
import type { ApprovalNodeData } from '../../types/nodes'

interface Props { nodeId: string; data: ApprovalNodeData }
const roles = ['Manager', 'HRBP', 'Director'] as const

export function ApprovalForm({ nodeId, data }: Props) {
  const update = useWorkflowStore((s) => s.updateNodeData)
  const patch = (partial: Partial<ApprovalNodeData>) =>
    update(nodeId, { type: NodeType.Approval, ...partial })

  return (
    <div className="space-y-4">
      <div>
        <label className="form-label">Title</label>
        <input className="form-input" value={data.label} onChange={e => patch({ label: e.target.value })} />
      </div>
      <div>
        <label className="form-label">Approver Role</label>
        <select
          className="form-input"
          value={data.approverRole}
          onChange={e => patch({ approverRole: e.target.value as ApprovalNodeData['approverRole'] })}
        >
          {roles.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>
      <div>
        <label className="form-label">
          Auto-Approve Threshold (days)
          <span className="text-slate-500 ml-1 text-xs normal-case">0 = disabled</span>
        </label>
        <input
          className="form-input"
          type="number"
          min={0}
          value={data.autoApproveThreshold}
          onChange={e => patch({ autoApproveThreshold: Number(e.target.value) })}
        />
      </div>
    </div>
  )
}
