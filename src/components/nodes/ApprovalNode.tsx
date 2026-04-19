import { memo } from 'react'
import { type NodeProps } from '@xyflow/react'
import { ShieldCheck } from 'lucide-react'
import { BaseNode } from './BaseNode'
import type { ApprovalNodeData } from '../../types/nodes'

export const ApprovalNode = memo(function ApprovalNode({ id, selected, data }: NodeProps & { data: ApprovalNodeData }) {
  return (
    <BaseNode id={id} selected={selected} accentColor="#f59e0b" icon={<ShieldCheck size={12} />} typeLabel="Approval">
      <p className="font-medium text-white truncate max-w-[160px]">{data.label}</p>
      <p className="text-xs text-slate-400 mt-0.5">🏷 {data.approverRole}</p>
      {data.autoApproveThreshold > 0 && (
        <p className="text-xs text-slate-500">Auto ≥ {data.autoApproveThreshold}d</p>
      )}
    </BaseNode>
  )
})
