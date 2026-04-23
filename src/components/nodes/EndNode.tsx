import { memo } from 'react'
import { type NodeProps } from '@xyflow/react'
import { Flag, MessageSquare } from 'lucide-react'
import { BaseNode } from './BaseNode'
import type { EndNodeData } from '../../types/nodes'

export const EndNode = memo(function EndNode({ id, selected, data }: NodeProps & { data: EndNodeData }) {
  return (
    <BaseNode id={id} selected={selected} accentColor="#ef4444" icon={<Flag size={12} />} typeLabel="End" hasSource={false}>
      <div className="flex flex-col gap-1.5 mt-0.5">
        <p className="font-bold text-white text-[13px] truncate">{data.label}</p>
        
        {data.endMessage && (
          <div className="flex items-start gap-1.5 text-[10px] text-red-200 bg-red-950/40 p-1.5 rounded border border-red-500/20 mt-0.5">
            <MessageSquare size={10} className="mt-0.5 shrink-0" />
            <span className="line-clamp-2 leading-tight">{data.endMessage}</span>
          </div>
        )}
      </div>
    </BaseNode>
  )
})
