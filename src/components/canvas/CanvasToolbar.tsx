import { Trash2, Download, Upload, Maximize2, ZoomIn, ZoomOut, Undo2, Redo2, Eraser } from 'lucide-react'
import { MarkerType, Position, useReactFlow } from '@xyflow/react'
import { useStore } from 'zustand'
import { useShallow } from 'zustand/react/shallow'
import { useWorkflowStore } from '../../hooks/useWorkflowStore'
import { serializeGraph } from '../../utils/graphSerializer'
import type { Node, Edge } from '@xyflow/react'
import type { WorkflowNodeData } from '../../types/nodes'

export function CanvasToolbar() {
  const { fitView, zoomIn, zoomOut } = useReactFlow()
  const {
    nodes,
    edges,
    clearWorkflow,
    importWorkflow,
    selectedNodeId,
    selectedEdgeId,
    deleteNode,
    deleteEdge,
  } = useWorkflowStore()
  
  const { undo, redo, pastStates, futureStates } = useStore(
    useWorkflowStore.temporal, 
    useShallow((state) => ({ 
      undo: state.undo, 
      redo: state.redo, 
      pastStates: state.pastStates, 
      futureStates: state.futureStates 
    }))
  )

  const syncGraphAfterTimeTravel = () => {
    const temporalState = useWorkflowStore.temporal.getState()
    temporalState.pause()

    useWorkflowStore.setState((state) => {
      let hasNodeChanges = false
      let hasEdgeChanges = false

      const nodes = state.nodes.map((node) => {
        const nextType = node.type ?? node.data.type
        const nextTargetPosition = node.targetPosition ?? Position.Left
        const nextSourcePosition = node.sourcePosition ?? Position.Right

        if (
          nextType !== node.type ||
          nextTargetPosition !== node.targetPosition ||
          nextSourcePosition !== node.sourcePosition
        ) {
          hasNodeChanges = true
          return {
            ...node,
            type: nextType,
            targetPosition: nextTargetPosition,
            sourcePosition: nextSourcePosition,
          }
        }

        return node
      })

      const edges = state.edges.map((edge) => {
        const nextAnimated = edge.animated ?? true
        const nextMarkerEnd = edge.markerEnd ?? { type: MarkerType.ArrowClosed }

        if (nextAnimated !== edge.animated || nextMarkerEnd !== edge.markerEnd) {
          hasEdgeChanges = true
          return {
            ...edge,
            animated: nextAnimated,
            markerEnd: nextMarkerEnd,
          }
        }

        return edge
      })

      const hasSelectedNode = state.selectedNodeId !== null && state.nodes.some((node) => node.id === state.selectedNodeId)
      const hasSelectedEdge = state.selectedEdgeId !== null && state.edges.some((edge) => edge.id === state.selectedEdgeId)
      const hasSimulatingNode = state.simulatingNodeId !== null && state.nodes.some((node) => node.id === state.simulatingNodeId)
      const selectedNodeId = hasSelectedNode ? state.selectedNodeId : null
      const selectedEdgeId = hasSelectedEdge ? state.selectedEdgeId : null
      const simulatingNodeId = hasSimulatingNode ? state.simulatingNodeId : null

      const hasTransientChanges =
        selectedNodeId !== state.selectedNodeId ||
        selectedEdgeId !== state.selectedEdgeId ||
        simulatingNodeId !== state.simulatingNodeId

      if (!hasNodeChanges && !hasEdgeChanges && !hasTransientChanges) {
        return state
      }

      return {
        nodes,
        edges,
        selectedNodeId,
        selectedEdgeId,
        simulatingNodeId,
      }
    })

    temporalState.resume()
  }

  const handleUndo = () => {
    undo()
    syncGraphAfterTimeTravel()
  }

  const handleRedo = () => {
    redo()
    syncGraphAfterTimeTravel()
  }

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

  const handleDeleteSelected = () => {
    if (selectedNodeId) {
      deleteNode(selectedNodeId)
      return
    }

    if (selectedEdgeId) {
      deleteEdge(selectedEdgeId)
    }
  }

  return (
    <div className="flex items-center gap-1 px-3 py-2 border-b border-border bg-surface">
      <ToolbarBtn onClick={() => zoomIn()} title="Zoom In"><ZoomIn size={14} /></ToolbarBtn>
      <ToolbarBtn onClick={() => zoomOut()} title="Zoom Out"><ZoomOut size={14} /></ToolbarBtn>
      <ToolbarBtn onClick={() => fitView({ padding: 0.2 })} title="Fit View"><Maximize2 size={14} /></ToolbarBtn>
      <div className="w-px h-4 bg-border mx-1" />
      <ToolbarBtn onClick={handleUndo} disabled={pastStates.length === 0} title="Undo"><Undo2 size={14} /></ToolbarBtn>
      <ToolbarBtn onClick={handleRedo} disabled={futureStates.length === 0} title="Redo"><Redo2 size={14} /></ToolbarBtn>
      <div className="w-px h-4 bg-border mx-1" />
      <ToolbarBtn onClick={handleExport} title="Export JSON"><Download size={14} /></ToolbarBtn>
      <ToolbarBtn onClick={handleImport} title="Import JSON"><Upload size={14} /></ToolbarBtn>
      <div className="w-px h-4 bg-border mx-1" />
      <ToolbarBtn
        onClick={handleDeleteSelected}
        disabled={!selectedNodeId && !selectedEdgeId}
        title={
          selectedNodeId
            ? 'Delete selected node'
            : selectedEdgeId
              ? 'Delete selected edge'
              : 'Select a node or edge to delete'
        }
        className="hover:text-danger"
      >
        <Trash2 size={14} />
      </ToolbarBtn>
      <ToolbarBtn onClick={clearWorkflow} title="Clear canvas" className="hover:text-warning">
        <Eraser size={14} />
      </ToolbarBtn>
    </div>
  )
}

function ToolbarBtn({ children, onClick, title, disabled, className = '' }: {
  children: React.ReactNode
  onClick: () => void
  title: string
  disabled?: boolean
  className?: string
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`flex items-center justify-center w-7 h-7 rounded text-slate-400 hover:text-white hover:bg-surfaceHover transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-slate-400 ${className}`}
    >
      {children}
    </button>
  )
}
