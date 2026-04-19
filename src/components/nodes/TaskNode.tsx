import { memo } from 'react'
import { type NodeProps } from '@xyflow/react'
import { ClipboardList } from 'lucide-react'
import { BaseNode } from './BaseNode'
import type { TaskNodeData } from '../../types/nodes'

export const TaskNode = memo(function TaskNode({ id, selected, data }: NodeProps & { data: TaskNodeData }) {
  return (
    <BaseNode id={id} selected={selected} accentColor="#6366f1" icon={<ClipboardList size={12} />} typeLabel="Task">
      <p className="font-medium text-white truncate max-w-[160px]">{data.label}</p>
      {data.assignee && <p className="text-xs text-slate-400 mt-0.5">👤 {data.assignee}</p>}
      {data.dueDate && <p className="text-xs text-slate-500">📅 {data.dueDate}</p>}
    </BaseNode>
  )
})
