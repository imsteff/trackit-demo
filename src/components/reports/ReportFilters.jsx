import { useState, useEffect } from 'react';
import ticketService from '../../services/ticketService';

const STATUS_OPTIONS = [
  { value: '', label: 'All Closed' },
  { value: '6', label: 'Resolved' },
  { value: '3', label: 'In Progress' },
  { value: '4', label: 'On Hold' },
  { value: '5', label: 'Cancelled' },
  { value: '10', label: 'Escalated' },
];

const DATE_TYPE_OPTIONS = [
  { value: '', label: 'Date Filter' },
  { value: '1', label: 'Date Reported' },
  { value: '2', label: 'Last Update' },
  { value: '3', label: 'Date Resolved' },
];

const RESOLUTION_OPTIONS = [
  { value: '', label: 'All Resolutions' },
  { value: '0', label: 'SDA' },
  { value: '1', label: 'On-Site' },
];

const selectCls =
  'bg-[#f8fafc] border border-[#e2e8f0] rounded-[7px] py-[7px] px-[10px] text-[#1e293b] text-[13px] outline-none focus:border-brand focus:bg-white';

export default function ReportFilters({ filters, onChange, onExport, exporting }) {
  const [categories, setCategories] = useState([]);
  const [technicians, setTechnicians] = useState([]);

  useEffect(() => {
    ticketService.getCategories().then(setCategories).catch(console.error);
    ticketService.getUsers().then(setTechnicians).catch(console.error);
  }, []);

  return (
    <div className="bg-white border border-[#e8ecf1] rounded-[10px] px-4 py-3 mb-[14px] flex items-center gap-[10px] flex-wrap">
      <div className="relative flex-1 min-w-[180px]">
        <i className="ti ti-search absolute left-[10px] top-1/2 -translate-y-1/2 text-[#94a3b8] text-[15px]" />
        <input
          value={filters.search}
          onChange={(e) => onChange('search', e.target.value)}
          placeholder="Search ticket ID or outlet..."
          className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-[7px] py-[7px] pl-8 pr-[10px] text-[#1e293b] text-[13px] outline-none focus:border-brand focus:bg-white placeholder:text-[#94a3b8]"
        />
      </div>

      <select className={selectCls} value={filters.ticket_status} onChange={(e) => onChange('ticket_status', e.target.value)}>
        {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>

      <select className={selectCls} value={filters.ticket_category} onChange={(e) => onChange('ticket_category', e.target.value)}>
        <option value="">All Categories</option>
        {categories.map((c) => <option key={c.cat_id} value={c.cat_id}>{c.cat_name}</option>)}
      </select>

      <select className={selectCls} value={filters.ticket_resolution} onChange={(e) => onChange('ticket_resolution', e.target.value)}>
        {RESOLUTION_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>

      <select className={selectCls} value={filters.technician} onChange={(e) => onChange('technician', e.target.value)}>
        <option value="">All Technicians</option>
        {technicians.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
      </select>

      <select className={selectCls} value={filters.date_type} onChange={(e) => onChange('date_type', e.target.value)}>
        {DATE_TYPE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>

      <input
        type="date"
        className={selectCls}
        value={filters.startdate}
        disabled={!filters.date_type}
        onChange={(e) => onChange('startdate', e.target.value)}
      />
      <input
        type="date"
        className={selectCls}
        value={filters.enddate}
        disabled={!filters.date_type}
        onChange={(e) => onChange('enddate', e.target.value)}
      />

      <button
        onClick={onExport}
        disabled={exporting}
        className="bg-brand text-white rounded-[7px] px-4 py-[7px] text-[13px] font-medium flex items-center gap-[6px] hover:opacity-90 disabled:opacity-60 whitespace-nowrap"
      >
        <i className={`ti ${exporting ? 'ti-loader animate-spin' : 'ti-download'} text-[14px]`} />
        Export
      </button>
    </div>
  );
}
