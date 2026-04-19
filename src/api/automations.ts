import type { AutomationAction } from '../types/api'

export async function getAutomations(): Promise<AutomationAction[]> {
  const res = await fetch('/automations')
  if (!res.ok) throw new Error('Failed to fetch automations')
  return res.json()
}
