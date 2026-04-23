import { memo } from 'react'
import { type NodeProps } from '@xyflow/react'
import { Play, Database } from 'lucide-react'
import { BaseNode } from './BaseNode'
import type { StartNodeData } from '../../types/nodes'

export const StartNode = memo(function StartNode({ id, selected, data }: NodeProps & { data: StartNodeData }) {
  const metaCount = Object.keys(data.metadata ?? {}).length
  return (
    <BaseNode id={id} selected={selected} accentColor="#22c55e" icon={<Play size={12} />} typeLabel="Start" hasTarget={false}>
      <div className="flex flex-col gap-1.5 mt-0.5">
        <p className="font-bold text-white text-[13px] truncate">{data.label}</p>
        {metaCount > 0 && (
          <div className="flex items-center gap-1 text-[10px] text-green-300/80 bg-green-500/10 px-1.5 py-0.5 rounded-md w-fit border border-green-500/20">
            <Database size={10} />
            {metaCount} metadata field{metaCount > 1 ? 's' : ''}
          </div>
        )}
      </div>
    </BaseNode>
  )
})
