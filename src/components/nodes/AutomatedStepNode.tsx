import { memo } from 'react'
import { type NodeProps } from '@xyflow/react'
import { Zap } from 'lucide-react'
import { BaseNode } from './BaseNode'
import type { AutomatedStepNodeData } from '../../types/nodes'

export const AutomatedStepNode = memo(function AutomatedStepNode({ id, selected, data }: NodeProps & { data: AutomatedStepNodeData }) {
  return (
    <BaseNode id={id} selected={selected} accentColor="#06b6d4" icon={<Zap size={12} />} typeLabel="Automated">
      <p className="font-medium text-white truncate max-w-[160px]">{data.label}</p>
      {data.actionId && <p className="text-xs text-cyan-400 mt-0.5">⚡ {data.actionId}</p>}
    </BaseNode>
  )
})
