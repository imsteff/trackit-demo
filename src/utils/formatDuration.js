import dayjs from 'dayjs';

export const resolutionTime = (start, end) => {
  if (!start || !end) return '—';
  const a = dayjs(start);
  const b = dayjs(end);
  if (!a.isValid() || !b.isValid()) return '—';

  let diff = Math.max(0, b.diff(a, 'second'));
  const days = Math.floor(diff / 86400); diff -= days * 86400;
  const hours = Math.floor(diff / 3600); diff -= hours * 3600;
  const minutes = Math.floor(diff / 60);

  const parts = [];
  if (days) parts.push(`${days}d`);
  if (hours) parts.push(`${hours}h`);
  if (minutes || (!days && !hours)) parts.push(`${minutes}m`);
  return parts.join(' ');
};
