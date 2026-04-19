import { Trash2, Download, Upload, Maximize2, ZoomIn, ZoomOut } from 'lucide-react'
import { useReactFlow } from '@xyflow/react'
import { useWorkflowStore } from '../../hooks/useWorkflowStore'
import { serializeGraph } from '../../utils/graphSerializer'
import type { Node, Edge } from '@xyflow/react'
import type { WorkflowNodeData } from '../../types/nodes'

export function CanvasToolbar() {
  const { fitView, zoomIn, zoomOut } = useReactFlow()
  const { nodes, edges, clearWorkflow, importWorkflow } = useWorkflowStore()

  const handleExport = () => {
    const graph = serializeGraph(nodes, edges)
    const blob = new Blob([JSON.stringify(graph, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'workflow.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = (ev) => {
        try {
          const graph = JSON.parse(ev.target?.result as string)
          importWorkflow(
            graph.nodes as Node<WorkflowNodeData>[],
            graph.edges as Edge[]
          )
        } catch {
          alert('Invalid workflow JSON file.')
        }
      }
      reader.readAsText(file)
    }
    input.click()
  }

  return (
    <div className="flex items-center gap-1 px-3 py-2 border-b border-border bg-surface">
      <ToolbarBtn onClick={() => zoomIn()} title="Zoom In"><ZoomIn size={14} /></ToolbarBtn>
      <ToolbarBtn onClick={() => zoomOut()} title="Zoom Out"><ZoomOut size={14} /></ToolbarBtn>
      <ToolbarBtn onClick={() => fitView({ padding: 0.2 })} title="Fit View"><Maximize2 size={14} /></ToolbarBtn>
      <div className="w-px h-4 bg-border mx-1" />
      <ToolbarBtn onClick={handleExport} title="Export JSON"><Download size={14} /></ToolbarBtn>
      <ToolbarBtn onClick={handleImport} title="Import JSON"><Upload size={14} /></ToolbarBtn>
      <div className="w-px h-4 bg-border mx-1" />
      <ToolbarBtn onClick={clearWorkflow} title="Clear canvas" className="hover:text-danger">
        <Trash2 size={14} />
      </ToolbarBtn>
    </div>
  )
}

function ToolbarBtn({ children, onClick, title, className = '' }: {
  children: React.ReactNode
  onClick: () => void
  title: string
  className?: string
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`flex items-center justify-center w-7 h-7 rounded text-slate-400 hover:text-white hover:bg-surfaceHover transition-all ${className}`}
    >
      {children}
    </button>
  )
}
