// Business hours: Mon–Fri 09:00–17:00 in UTC
const BIZ_START = 9
const BIZ_END = 17

function isWeekend(date: Date): boolean {
  const day = date.getUTCDay()
  return day === 0 || day === 6
}

function isInBusinessHours(date: Date): boolean {
  if (isWeekend(date)) return false
  const hour = date.getUTCHours()
  return hour >= BIZ_START && hour < BIZ_END
}

/** Add `minutes` of business time to `from`, respecting Mon–Fri 09–17 UTC. */
function addBusinessMinutes(from: Date, minutes: number): Date {
  let remaining = minutes
  const cursor = new Date(from)

  // Fast-forward cursor into business hours if needed
  while (!isInBusinessHours(cursor)) {
    cursor.setUTCMinutes(cursor.getUTCMinutes() + 1)
  }

  while (remaining > 0) {
    cursor.setUTCMinutes(cursor.getUTCMinutes() + 1)
    if (isInBusinessHours(cursor)) remaining--
  }

  return cursor
}

/** Add `minutes` of calendar time to `from`. */
function addCalendarMinutes(from: Date, minutes: number): Date {
  return new Date(from.getTime() + minutes * 60_000)
}

export function calculateSlaDeadline(
  createdAt: Date,
  resolutionTimeMinutes: number,
  businessHoursOnly: boolean
): Date {
  return businessHoursOnly
    ? addBusinessMinutes(createdAt, resolutionTimeMinutes)
    : addCalendarMinutes(createdAt, resolutionTimeMinutes)
}

export function isSlaBreached(deadline: Date | null): boolean {
  if (!deadline) return false
  return new Date() > deadline
}

export function slaDueLabel(deadline: Date | null): {
  label: string
  color: string
} {
  if (!deadline) return { label: "No SLA", color: "#8899b4" }

  const now = Date.now()
  const diff = deadline.getTime() - now

  if (diff < 0) return { label: "Breached", color: "#ff4757" }
  if (diff < 30 * 60_000) return { label: "< 30 min", color: "#ff4757" }
  if (diff < 60 * 60_000) return { label: "< 1 hour", color: "#f0b429" }

  const hours = Math.floor(diff / 3_600_000)
  const mins = Math.floor((diff % 3_600_000) / 60_000)
  const label = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  return { label, color: "#10d98a" }
}
