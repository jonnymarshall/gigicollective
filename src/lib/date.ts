/**
 * Dates written in the CMS are stored without a time, which JavaScript reads as
 * midnight UTC. Formatting those in the visitor's own timezone can shift them a
 * day earlier or later. Always format in UTC so the date shown is the date typed.
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
}
