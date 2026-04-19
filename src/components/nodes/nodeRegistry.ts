import type { NodeTypes } from '@xyflow/react'
import { StartNode } from './StartNode'
import { TaskNode } from './TaskNode'
import { ApprovalNode } from './ApprovalNode'
import { AutomatedStepNode } from './AutomatedStepNode'
import { EndNode } from './EndNode'
import { NodeType } from '../../types/nodes'

export const nodeTypes: NodeTypes = {
  [NodeType.Start]: StartNode as never,
  [NodeType.Task]: TaskNode as never,
  [NodeType.Approval]: ApprovalNode as never,
  [NodeType.AutomatedStep]: AutomatedStepNode as never,
  [NodeType.End]: EndNode as never,
}
