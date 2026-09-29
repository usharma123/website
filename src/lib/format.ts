// Dates are formatted with a fixed locale and zone so the server and the
// browser render identical text.
const DATE = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  timeZone: 'UTC',
})

/** "2026-06-02" → "Jun 2, 2026" */
export function formatDate(iso: string) {
  return DATE.format(new Date(`${iso}T12:00:00Z`))
}

/** "November 2025" → "Nov 2025" */
export function shortMonth(date: string) {
  return date.replace(/^(\w{3})\w+(?= \d)/, '$1')
}
