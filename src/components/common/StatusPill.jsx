const STATUS_MAP = {
  1:  { label: 'Waiting',     cls: 'bg-[#fffbeb] text-[#b45309]',  dot: 'bg-[#f59e0b]' },
  2:  { label: 'Waiting',     cls: 'bg-[#fffbeb] text-[#b45309]',  dot: 'bg-[#f59e0b]' },
  3:  { label: 'In Progress', cls: 'bg-[#eff6ff] text-[#1d4ed8]',  dot: 'bg-[#3b82f6]' },
  4:  { label: 'On Hold',     cls: 'bg-[#f5f3ff] text-[#6d28d9]',  dot: 'bg-[#8b5cf6]' },
  5:  { label: 'Cancelled',   cls: 'bg-[#fef2f2] text-[#dc2626]',  dot: 'bg-[#ef4444]' },
  6:  { label: 'Resolved',    cls: 'bg-[#f0fdf4] text-[#15803d]',  dot: 'bg-[#22c55e]' },
  7:  { label: 'Merged',      cls: 'bg-[#f8fafc] text-[#64748b]',  dot: 'bg-[#94a3b8]' },
  8:  { label: 'IT Active',   cls: 'bg-[#eff6ff] text-brand',       dot: 'bg-brand' },
  10: { label: 'Escalated',   cls: 'bg-[#fef2f2] text-[#dc2626]',  dot: 'bg-[#ef4444]' },
};

export default function StatusPill({ status }) {
  const s = STATUS_MAP[status] || { label: 'Unknown', cls: 'bg-[#f8fafc] text-[#94a3b8]', dot: 'bg-[#cbd5e1]' };
  return (
    <span className={`inline-flex items-center gap-[5px] px-[9px] py-[3px] rounded-full text-[11px] font-semibold ${s.cls}`}>
      <span className={`w-[5px] h-[5px] rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}
