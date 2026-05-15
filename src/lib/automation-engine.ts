import { db } from "@/lib/db"
import type { TicketStatus, TicketPriority } from "@/types"

interface ConditionRule {
  field: string
  op: string
  value: string
}

interface ConditionsConfig {
  operator: "AND" | "OR"
  rules: ConditionRule[]
}

interface ActionConfig {
  type: string
  value: string
}

interface TicketSnapshot {
  id: string
  subject: string
  status: string
  priority: string
  channel: string
  tags: string[]
  assigneeId: string | null
  requesterId: string
}

function evaluateRule(rule: ConditionRule, ticket: TicketSnapshot): boolean {
  const raw = (() => {
    switch (rule.field) {
      case "priority": return ticket.priority
      case "status": return ticket.status
      case "channel": return ticket.channel
      case "subject": return ticket.subject.toLowerCase()
      case "tags": return ticket.tags.join(",").toLowerCase()
      case "assignee": return ticket.assigneeId ?? ""
      default: return ""
    }
  })()

  const val = rule.value.toLowerCase()

  switch (rule.op) {
    case "equals": return raw === val
    case "not_equals": return raw !== val
    case "contains": return raw.includes(val)
    case "not_contains": return !raw.includes(val)
    case "is_empty": return raw === ""
    case "is_not_empty": return raw !== ""
    default: return false
  }
}

function evaluateConditions(
  conditions: ConditionsConfig,
  ticket: TicketSnapshot
): boolean {
  if (!conditions.rules?.length) return true
  const results = conditions.rules.map((r) => evaluateRule(r, ticket))
  return conditions.operator === "AND"
    ? results.every(Boolean)
    : results.some(Boolean)
}

async function executeAction(
  action: ActionConfig,
  ticketId: string
): Promise<void> {
  switch (action.type) {
    case "set_status":
      await db.ticket.update({
        where: { id: ticketId },
        data: {
          status: action.value as TicketStatus,
          ...(action.value === "solved" ? { solvedAt: new Date() } : {}),
        },
      })
      break

    case "set_priority":
      await db.ticket.update({
        where: { id: ticketId },
        data: { priority: action.value as TicketPriority },
      })
      break

    case "add_tag":
      await db.ticket.update({
        where: { id: ticketId },
        data: { tags: { push: action.value } },
      })
      break

    case "assign_agent":
      await db.ticket.update({
        where: { id: ticketId },
        data: { assigneeId: action.value || null },
      })
      break

    case "assign_group":
      await db.ticket.update({
        where: { id: ticketId },
        data: { groupId: action.value || null },
      })
      break

    default:
      break
  }
}

export async function runAutomations(
  triggerEvent: string,
  ticket: TicketSnapshot
): Promise<void> {
  const automations = await db.automation.findMany({
    where: { triggerEvent, isActive: true },
    orderBy: { priority: "desc" },
  })

  for (const automation of automations) {
    const conditions = automation.conditions as unknown as ConditionsConfig
    const actions = automation.actions as unknown as ActionConfig[]

    if (!evaluateConditions(conditions, ticket)) continue

    for (const action of actions) {
      await executeAction(action, ticket.id)
    }

    await db.automation.update({
      where: { id: automation.id },
      data: { lastRun: new Date() },
    })
  }
}
