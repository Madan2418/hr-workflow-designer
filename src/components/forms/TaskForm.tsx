import { useWorkflowStore } from '../../hooks/useWorkflowStore'
import { NodeType } from '../../types/nodes'
import type { TaskNodeData } from '../../types/nodes'
import { KeyValueInput } from './KeyValueInput'

interface Props { nodeId: string; data: TaskNodeData }

export function TaskForm({ nodeId, data }: Props) {
  const update = useWorkflowStore((s) => s.updateNodeData)
  const patch = (partial: Partial<TaskNodeData>) =>
    update(nodeId, { type: NodeType.Task, ...partial })

  return (
    <div className="space-y-4">
      <div>
        <label className="form-label">Title <span className="text-danger">*</span></label>
        <input className="form-input" value={data.label} onChange={e => patch({ label: e.target.value })} />
      </div>
      <div>
        <label className="form-label">Description</label>
        <textarea
          className="form-input resize-none"
          rows={2}
          value={data.description}
          onChange={e => patch({ description: e.target.value })}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="form-label">Assignee</label>
          <input className="form-input" placeholder="e.g. John Doe" value={data.assignee} onChange={e => patch({ assignee: e.target.value })} />
        </div>
        <div>
          <label className="form-label">Due Date</label>
          <input className="form-input" type="date" value={data.dueDate} onChange={e => patch({ dueDate: e.target.value })} />
        </div>
      </div>
      <KeyValueInput
        label="Custom Fields"
        value={data.customFields}
        onChange={customFields => patch({ customFields })}
      />
    </div>
  )
}
