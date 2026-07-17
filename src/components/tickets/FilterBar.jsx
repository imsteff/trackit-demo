const FILTERS = [
  { label: 'All',         value: '',  icon: 'ti-list' },
  { label: 'Waiting',     value: '1', icon: 'ti-clock' },
  { label: 'In Progress', value: '3', icon: 'ti-loader' },
  { label: 'P1 Only',     value: 'p1', icon: 'ti-alert-triangle' },
];

export default function FilterBar({ search, onSearch, statusFilter, onStatusFilter }) {
  return (
    <div className="bg-white border border-[#e8ecf1] rounded-[10px] px-4 py-3 mb-[14px] flex items-center gap-[10px] flex-wrap">
      <div className="relative flex-1 min-w-[180px]">
        <i className="ti ti-search absolute left-[10px] top-1/2 -translate-y-1/2 text-[#94a3b8] text-[15px]" />
        <input
          value={search}
          onChange={e => onSearch(e.target.value)}
          placeholder="Search ticket ID, subject, assignee..."
          className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-[7px] py-[7px] pl-8 pr-[10px] text-[#1e293b] text-[13px] outline-none focus:border-brand focus:bg-white placeholder:text-[#94a3b8]"
        />
      </div>
      <div className="w-px h-6 bg-[#e8ecf1]" />
      {FILTERS.map(f => (
        <button
          key={f.value}
          onClick={() => onStatusFilter(f.value)}
          className={
            'bg-[#f8fafc] border rounded-[6px] px-3 py-[6px] text-[12px] flex items-center gap-[5px] font-medium whitespace-nowrap transition-all ' +
            (statusFilter === f.value
              ? 'border-brand text-brand bg-[#eff6ff]'
              : 'border-[#e2e8f0] text-[#64748b] hover:border-[#cbd5e1] hover:text-[#1e293b]')
          }
        >
          <i className={`ti ${f.icon} text-[13px]`} />
          {f.label}
        </button>
      ))}
    </div>
  );
}
