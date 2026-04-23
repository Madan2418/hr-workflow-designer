import { useCallback, useRef } from 'react'
import {
  ReactFlow,
  Background,
  MiniMap,
  BackgroundVariant,
  MarkerType,
  useReactFlow,
  type EdgeMouseHandler,
  type NodeMouseHandler,
  type OnSelectionChangeFunc,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { useWorkflowStore } from '../../hooks/useWorkflowStore'
import { nodeTypes } from '../nodes/nodeRegistry'
import { CanvasToolbar } from './CanvasToolbar'
import type { NodeType } from '../../types/nodes'

const flowProOptions = { hideAttribution: true }
const flowDefaultEdgeOptions = {
  animated: true,
  style: { stroke: '#4f52a0', strokeWidth: 2 },
  markerEnd: { type: MarkerType.ArrowClosed },
}

export function WorkflowCanvas({ onOpenTemplates }: { onOpenTemplates?: () => void }) {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    setSelectedNode,
    setSelectedEdge,
    clearSelection,
    addNode,
  } = useWorkflowStore()

  const { screenToFlowPosition } = useReactFlow()
  const wrapperRef = useRef<HTMLDivElement>(null)

  const onNodeClick: NodeMouseHandler = useCallback((_, node) => {
    setSelectedNode(node.id)
  }, [setSelectedNode])

  const onPaneClick = useCallback(() => {
    clearSelection()
  }, [clearSelection])

  const onEdgeClick: EdgeMouseHandler = useCallback((_, edge) => {
    setSelectedEdge(edge.id)
  }, [setSelectedEdge])

  const onSelectionChange: OnSelectionChangeFunc = useCallback(({ nodes: selectedNodes, edges: selectedEdges }) => {
    if (selectedNodes.length > 0) {
      setSelectedNode(selectedNodes[0].id)
      return
    }

    if (selectedEdges.length > 0) {
      setSelectedEdge(selectedEdges[0].id)
      return
    }

    clearSelection()
  }, [clearSelection, setSelectedEdge, setSelectedNode])

  const onDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }, [])

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const type = e.dataTransfer.getData('application/reactflow') as NodeType
    if (!type) return
    const position = screenToFlowPosition({ x: e.clientX, y: e.clientY })
    addNode(type, position)
  }, [screenToFlowPosition, addNode])

  return (
    <div className="flex flex-col flex-1 min-w-0 min-h-0">
      <CanvasToolbar />
      <div ref={wrapperRef} className="flex-1 relative" onDragOver={onDragOver} onDrop={onDrop}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onEdgeClick={onEdgeClick}
          onSelectionChange={onSelectionChange}
          onPaneClick={onPaneClick}
          deleteKeyCode="Delete"
          fitView
          proOptions={flowProOptions}
          defaultEdgeOptions={flowDefaultEdgeOptions}
        >
          <Background variant={BackgroundVariant.Dots} color="#2e3148" gap={20} size={1.2} />
          <MiniMap
            position="bottom-right"
            nodeColor={(n) => {
              const t = (n.data as { type?: string })?.type
              if (t === 'start') return '#22c55e'
              if (t === 'task') return '#6366f1'
              if (t === 'approval') return '#f59e0b'
              if (t === 'automatedStep') return '#06b6d4'
              if (t === 'end') return '#ef4444'
              return '#475569'
            }}
            maskColor="#0f111799"
            style={{ borderRadius: 8 }}
          />
        </ReactFlow>

        {nodes.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none bg-canvas/30 backdrop-blur-[2px]">
            <div className="w-16 h-16 rounded-2xl bg-surface border border-borderBright flex items-center justify-center mb-4 shadow-xl">
              <div className="text-3xl opacity-50">✦</div>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Build Your Workflow</h3>
            <p className="text-slate-400 text-sm max-w-[280px] text-center mb-6 leading-relaxed">
              Drag nodes from the sidebar onto the canvas to start building from scratch, or choose a pre-built template.
            </p>
            {onOpenTemplates && (
              <button 
                onClick={onOpenTemplates}
                className="btn-primary w-auto px-6 pointer-events-auto"
              >
                Choose a Template
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
