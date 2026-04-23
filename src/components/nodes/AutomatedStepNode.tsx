import { memo } from 'react'
import { type NodeProps } from '@xyflow/react'
import { Zap, TerminalSquare } from 'lucide-react'
import { BaseNode } from './BaseNode'
import type { AutomatedStepNodeData } from '../../types/nodes'

export const AutomatedStepNode = memo(function AutomatedStepNode({ id, selected, data }: NodeProps & { data: AutomatedStepNodeData }) {
  return (
    <BaseNode id={id} selected={selected} accentColor="#06b6d4" icon={<Zap size={12} />} typeLabel="Automated">
      <div className="flex flex-col gap-2 mt-0.5">
        <p className="font-bold text-white text-[13px] truncate">{data.label}</p>
        
        {data.actionId ? (
          <span className="flex items-center gap-1 text-[10px] text-cyan-300 bg-cyan-700/20 px-1.5 py-0.5 rounded w-fit border border-cyan-500/20">
            <TerminalSquare size={10} /> {data.actionId}
          </span>
        ) : (
          <span className="flex items-center gap-1 text-[10px] text-danger bg-danger/10 px-1.5 py-0.5 rounded w-fit border border-danger/20">
            <TerminalSquare size={10} /> No action selected
          </span>
        )}
      </div>
    </BaseNode>
  )
})
