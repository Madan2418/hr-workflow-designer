import type { DragEvent } from 'react'
import type { NodeType } from '../types/nodes'

export function useDragDrop(addNode: (type: NodeType, pos: { x: number; y: number }) => void) {
  const onDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const onDrop = (e: DragEvent<HTMLDivElement>, reactFlowWrapper: HTMLDivElement | null) => {
    e.preventDefault()
    const type = e.dataTransfer.getData('application/reactflow') as NodeType
    if (!type || !reactFlowWrapper) return

    const rect = reactFlowWrapper.getBoundingClientRect()
    // approximate position — ReactFlow's screenToFlowPosition is called in the canvas
    const position = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }
    addNode(type, position)
  }

  return { onDragOver, onDrop }
}
