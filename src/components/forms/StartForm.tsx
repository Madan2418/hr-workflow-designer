import { useWorkflowStore } from '../../hooks/useWorkflowStore'
import { NodeType } from '../../types/nodes'
import type { StartNodeData } from '../../types/nodes'
import { KeyValueInput } from './KeyValueInput'

interface Props { nodeId: string; data: StartNodeData }

export function StartForm({ nodeId, data }: Props) {
  const update = useWorkflowStore((s) => s.updateNodeData)

  return (
    <div className="space-y-4">
      <div>
        <label className="form-label">Title</label>
        <input
          className="form-input"
          value={data.label}
          onChange={e => update(nodeId, { type: NodeType.Start, label: e.target.value })}
        />
      </div>
      <KeyValueInput
        label="Metadata"
        value={data.metadata}
        onChange={metadata => update(nodeId, { type: NodeType.Start, metadata })}
      />
    </div>
  )
}
