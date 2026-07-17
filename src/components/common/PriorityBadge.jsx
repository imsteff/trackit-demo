const PRIORITY_MAP = {
  P1: 'bg-[#fef2f2] text-[#dc2626]',
  P2: 'bg-[#fffbeb] text-[#d97706]',
  P3: 'bg-[#f8fafc] text-[#94a3b8] border border-[#e2e8f0]',
};

export default function PriorityBadge({ priority }) {
  const normalized = (priority || 'P3').replace(/[\[\]]/g, '');
  const cls = PRIORITY_MAP[normalized] || PRIORITY_MAP.P3;
  return (
    <span className={`inline-flex items-center justify-center w-[26px] h-5 rounded-[5px] text-[11px] font-bold ${cls}`}>
      {normalized}
    </span>
  );
}
