// ─── NodeType — const+type instead of enum (required by erasableSyntaxOnly) ──

export const NodeType = {
  Start: 'start',
  Task: 'task',
  Approval: 'approval',
  AutomatedStep: 'automatedStep',
  End: 'end',
} as const

export type NodeType = (typeof NodeType)[keyof typeof NodeType]

// ─── Node data interfaces — all extend Record<string,unknown> so they satisfy
//     @xyflow/react v12's constraint on node data types ─────────────────────

export interface StartNodeData extends Record<string, unknown> {
  type: 'start'
  label: string
  metadata: Record<string, string>
}

export interface TaskNodeData extends Record<string, unknown> {
  type: 'task'
  label: string
  description: string
  assignee: string
  dueDate: string
  customFields: Record<string, string>
}

export interface ApprovalNodeData extends Record<string, unknown> {
  type: 'approval'
  label: string
  approverRole: 'Manager' | 'HRBP' | 'Director'
  autoApproveThreshold: number
}

export interface AutomatedStepNodeData extends Record<string, unknown> {
  type: 'automatedStep'
  label: string
  actionId: string
  actionParams: Record<string, string>
}

export interface EndNodeData extends Record<string, unknown> {
  type: 'end'
  label: string
  endMessage: string
  showSummary: boolean
}

/** Discriminated union — switch on data.type for full type safety */
export type WorkflowNodeData =
  | StartNodeData
  | TaskNodeData
  | ApprovalNodeData
  | AutomatedStepNodeData
  | EndNodeData
