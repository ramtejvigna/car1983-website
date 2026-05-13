// ─── Currency ────────────────────────────────────────────────────────────────

export function formatCents(cents: number, locale = 'en-US', currency = 'USD'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(cents / 100)
}

// ─── Distance ────────────────────────────────────────────────────────────────

export function formatDistance(meters: number): string {
  const miles = meters / 1609.344
  return `${miles.toFixed(1)} mi`
}

// ─── Duration ────────────────────────────────────────────────────────────────

export function formatDuration(seconds: number): string {
  const minutes = Math.round(seconds / 60)
  if (minutes < 60) return `${minutes} min`
  const hours = Math.floor(minutes / 60)
  const remaining = minutes % 60
  return remaining > 0 ? `${hours} hr ${remaining} min` : `${hours} hr`
}

// ─── Phone ───────────────────────────────────────────────────────────────────

export function formatPhone(e164: string): string {
  const digits = e164.replace(/\D/g, '')
  if (digits.length === 11 && digits.startsWith('1')) {
    const local = digits.slice(1)
    return `(${local.slice(0, 3)}) ${local.slice(3, 6)}-${local.slice(6)}`
  }
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
  }
  return e164
}

// ─── Relative Time ───────────────────────────────────────────────────────────

export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const diffSeconds = Math.floor((Date.now() - d.getTime()) / 1000)
  if (diffSeconds < 60) return 'just now'
  if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)} min ago`
  if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)} hr ago`
  if (diffSeconds < 604800) return `${Math.floor(diffSeconds / 86400)} days ago`
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

// ─── Email ───────────────────────────────────────────────────────────────────

export function maskEmail(email: string): string {
  const [local, domain] = email.split('@')
  if (!local || !domain) return email
  const visible = local.slice(0, 2)
  const masked = '*'.repeat(Math.max(local.length - 2, 2))
  return `${visible}${masked}@${domain}`
}

// ─── Numbers ─────────────────────────────────────────────────────────────────

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

// ─── Strings ─────────────────────────────────────────────────────────────────

export function toTitleCase(str: string): string {
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str
  return `${str.slice(0, maxLength - 1)}…`
}
