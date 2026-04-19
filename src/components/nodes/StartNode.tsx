import { memo } from 'react'
import { type NodeProps } from '@xyflow/react'
import { Play } from 'lucide-react'
import { BaseNode } from './BaseNode'
import type { StartNodeData } from '../../types/nodes'

export const StartNode = memo(function StartNode({ id, selected, data }: NodeProps & { data: StartNodeData }) {
  const metaCount = Object.keys(data.metadata ?? {}).length
  return (
    <BaseNode id={id} selected={selected} accentColor="#22c55e" icon={<Play size={12} />} typeLabel="Start" hasTarget={false}>
      <p className="font-medium text-white truncate max-w-[160px]">{data.label}</p>
      {metaCount > 0 && (
        <p className="text-xs text-slate-400 mt-1">{metaCount} metadata field{metaCount > 1 ? 's' : ''}</p>
      )}
    </BaseNode>
  )
})
