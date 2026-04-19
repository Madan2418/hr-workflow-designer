import { memo } from 'react'
import { type NodeProps } from '@xyflow/react'
import { Flag } from 'lucide-react'
import { BaseNode } from './BaseNode'
import type { EndNodeData } from '../../types/nodes'

export const EndNode = memo(function EndNode({ id, selected, data }: NodeProps & { data: EndNodeData }) {
  return (
    <BaseNode id={id} selected={selected} accentColor="#ef4444" icon={<Flag size={12} />} typeLabel="End" hasSource={false}>
      <p className="font-medium text-white truncate max-w-[160px]">{data.label}</p>
      {data.endMessage && <p className="text-xs text-slate-400 mt-0.5 truncate max-w-[160px]">{data.endMessage}</p>}
    </BaseNode>
  )
})
