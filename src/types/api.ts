export interface AutomationAction {
  id: string
  label: string
  params: string[]
}

export interface SimulatePayload {
  nodes: unknown[]
  edges: unknown[]
}
