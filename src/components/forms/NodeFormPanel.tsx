import { X } from 'lucide-react'
import { useWorkflowStore, getSelectedNode } from '../../hooks/useWorkflowStore'
import { NodeType } from '../../types/nodes'
import { StartForm } from './StartForm'
import { TaskForm } from './TaskForm'
import { ApprovalForm } from './ApprovalForm'
import { AutomatedStepForm } from './AutomatedStepForm'
import { EndForm } from './EndForm'

const nodeTypeLabelMap: Record<NodeType, string> = {
  [NodeType.Start]: 'Start Node',
  [NodeType.Task]: 'Task Node',
  [NodeType.Approval]: 'Approval Node',
  [NodeType.AutomatedStep]: 'Automated Step',
  [NodeType.End]: 'End Node',
}

export function NodeFormPanel() {
  const selected = useWorkflowStore(getSelectedNode)
  const setSelectedNode = useWorkflowStore((s) => s.setSelectedNode)

  if (!selected) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-6 text-slate-500">
        <div className="text-4xl mb-3">🖱️</div>
        <p className="text-sm">Click any node on the canvas to configure it.</p>
      </div>
    )
  }

  const { id, data } = selected

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <h3 className="text-sm font-semibold text-white">{nodeTypeLabelMap[data.type]}</h3>
        <button
          onClick={() => setSelectedNode(null)}
          className="text-slate-500 hover:text-white transition-colors"
        >
          <X size={16} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {data.type === NodeType.Start && <StartForm nodeId={id} data={data} />}
        {data.type === NodeType.Task && <TaskForm nodeId={id} data={data} />}
        {data.type === NodeType.Approval && <ApprovalForm nodeId={id} data={data} />}
        {data.type === NodeType.AutomatedStep && <AutomatedStepForm nodeId={id} data={data} />}
        {data.type === NodeType.End && <EndForm nodeId={id} data={data} />}
      </div>
    </div>
  )
}
