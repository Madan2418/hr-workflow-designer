import { memo } from 'react'
import { type NodeProps } from '@xyflow/react'
import { ShieldCheck, Tag, Clock } from 'lucide-react'
import { BaseNode } from './BaseNode'
import type { ApprovalNodeData } from '../../types/nodes'

export const ApprovalNode = memo(function ApprovalNode({ id, selected, data }: NodeProps & { data: ApprovalNodeData }) {
  return (
    <BaseNode id={id} selected={selected} accentColor="#f59e0b" icon={<ShieldCheck size={12} />} typeLabel="Approval">
      <div className="flex flex-col gap-2 mt-0.5">
        <p className="font-bold text-white text-[13px] truncate">{data.label}</p>
        
        <div className="flex flex-wrap gap-1.5">
          <span className="flex items-center gap-1 text-[10px] text-amber-300 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
            <Tag size={10} /> {data.approverRole}
          </span>
          
          {data.autoApproveThreshold > 0 && (
            <span className="flex items-center gap-1 text-[10px] text-emerald-300 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
              <Clock size={10} /> Auto ≥ {data.autoApproveThreshold}d
            </span>
          )}
        </div>
      </div>
    </BaseNode>
  )
})
