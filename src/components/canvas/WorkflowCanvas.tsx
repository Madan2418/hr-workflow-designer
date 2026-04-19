import { useCallback, useRef } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  useReactFlow,
  type NodeMouseHandler,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { useWorkflowStore } from '../../hooks/useWorkflowStore'
import { nodeTypes } from '../nodes/nodeRegistry'
import { CanvasToolbar } from './CanvasToolbar'
import type { NodeType } from '../../types/nodes'

export function WorkflowCanvas() {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    setSelectedNode,
    addNode,
  } = useWorkflowStore()

  const { screenToFlowPosition } = useReactFlow()
  const wrapperRef = useRef<HTMLDivElement>(null)

  const onNodeClick: NodeMouseHandler = useCallback((_, node) => {
    setSelectedNode(node.id)
  }, [setSelectedNode])

  const onPaneClick = useCallback(() => {
    setSelectedNode(null)
  }, [setSelectedNode])

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
          onPaneClick={onPaneClick}
          deleteKeyCode="Delete"
          fitView
          proOptions={{ hideAttribution: true }}
          defaultEdgeOptions={{ animated: true, style: { stroke: '#6366f1', strokeWidth: 2 } }}
        >
          <Background variant={BackgroundVariant.Dots} color="#2e3148" gap={20} size={1.2} />
          <Controls position="bottom-left" />
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
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <div className="text-5xl mb-4 opacity-20">⬡</div>
            <p className="text-slate-600 text-sm">Drag nodes from the sidebar to start building</p>
          </div>
        )}
      </div>
    </div>
  )
}
