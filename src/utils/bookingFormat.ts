import { PIERCING_OPTIONS } from '../data/studioData';

// "2026-12-05" -> "Saturday, December 5, 2026"
// Parsed manually so the date never shifts because of timezones.
export function formatBookingDate(isoDate: string): string {
  const [year, month, day] = isoDate.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// "ear" -> "Ear"
export function piercingLabel(value: string): string {
  return PIERCING_OPTIONS.find((option) => option.value === value)?.label ?? value;
}