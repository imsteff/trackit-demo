const TABS = [
  { key: 'details', label: 'Details' },
  { key: 'time_analysis', label: 'Time Analysis' },
  { key: 'history_logs', label: 'History Logs' },
];

export default function TicketTabs({ activeTab, onChange }) {
  return (
    <div className="bg-white border-b border-[#e8ecf1] px-6 flex gap-0 shrink-0">
      {TABS.map(t => (
        <button
          key={t.key}
          onClick={() => onChange(t.key)}
          className={`px-[18px] py-[10px] text-[12px] font-semibold border-b-2 transition-all whitespace-nowrap ${
            activeTab === t.key
              ? 'text-brand border-brand'
              : 'text-[#94a3b8] border-transparent hover:text-[#0f172a]'
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
