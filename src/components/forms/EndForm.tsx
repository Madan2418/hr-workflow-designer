import { useWorkflowStore } from '../../hooks/useWorkflowStore'
import { NodeType } from '../../types/nodes'
import type { EndNodeData } from '../../types/nodes'

interface Props { nodeId: string; data: EndNodeData }

export function EndForm({ nodeId, data }: Props) {
  const update = useWorkflowStore((s) => s.updateNodeData)
  const patch = (partial: Partial<EndNodeData>) =>
    update(nodeId, { type: NodeType.End, ...partial })

  return (
    <div className="space-y-4">
      <div>
        <label className="form-label">Title</label>
        <input className="form-input" value={data.label} onChange={e => patch({ label: e.target.value })} />
      </div>
      <div>
        <label className="form-label">End Message</label>
        <textarea
          className="form-input resize-none"
          rows={2}
          value={data.endMessage}
          onChange={e => patch({ endMessage: e.target.value })}
        />
      </div>
      <div className="flex items-center gap-3">
        <label className="form-label mb-0">Show Summary</label>
        <button
          type="button"
          onClick={() => patch({ showSummary: !data.showSummary })}
          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
            data.showSummary ? 'bg-accent' : 'bg-slate-700'
          }`}
        >
          <span
            className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${
              data.showSummary ? 'translate-x-4.5' : 'translate-x-0.5'
            }`}
          />
        </button>
      </div>
    </div>
  )
}
