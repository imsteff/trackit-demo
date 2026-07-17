import { useState } from 'react';
import dayjs from 'dayjs';
import { useMergedTickets, useCounts } from '../../hooks/useTickets';
import { useAuth } from '../../context/AuthContext';
import Topbar from '../../components/layout/Topbar';
import ScrollArea from '../../components/common/ScrollArea';
import StatusPill from '../../components/common/StatusPill';
import MergedViewModal from './components/MergedViewModal';

const LIMIT_OPTIONS = [10, 25, 50, 100];

function buildPageRange(page, totalPages) {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
  const range = new Set([1, totalPages, page]);
  if (page > 1) range.add(page - 1);
  if (page < totalPages) range.add(page + 1);
  const sorted = [...range].sort((a, b) => a - b);
  const result = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) result.push('…');
    result.push(p);
  });
  return result;
}

function StatCard({ label, value, colorCls, iconCls, icon }) {
  return (
    <div className="bg-white border border-[#e8ecf1] rounded-[10px] p-[14px_16px] flex items-center justify-between">
      <div>
        <div className="text-[10px] font-semibold uppercase tracking-[0.6px] text-[#94a3b8] mb-[6px]">{label}</div>
        <div className={`text-[26px] font-bold tracking-[-1px] leading-none ${colorCls}`}>{value ?? 0}</div>
      </div>
      <div className={`w-9 h-9 rounded-[9px] flex items-center justify-center ${iconCls}`}>
        <i className={`${icon} text-[18px]`} />
      </div>
    </div>
  );
}

export default function MergedTicketsPage() {
  const { user } = useAuth();
  const isIT = user?.itpd_status === 0;

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState('');
  const [sortDir, setSortDir] = useState('desc');
  const [activeTicketId, setActiveTicketId] = useState(null);

  const params = { search, page, limit, sortBy, sortDir };
  const { tickets, total, loading } = useMergedTickets(params);
  const { counts } = useCounts();

  const totalPages = Math.ceil(total / limit);
  const start = total === 0 ? 0 : (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  const handleSearch = (val) => { setSearch(val); setPage(1); };
  const handleLimit = (val) => { setLimit(Number(val)); setPage(1); };
  const handleSort = (key) => {
    if (sortBy === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(key);
      setSortDir('asc');
    }
    setPage(1);
  };

  const sortIcon = (key) => {
    if (sortBy !== key) return 'ti ti-selector text-[#cbd5e1]';
    return sortDir === 'asc' ? 'ti ti-arrow-up text-brand' : 'ti ti-arrow-down text-brand';
  };

  return (
    <>
      <Topbar />
      <ScrollArea className="flex-1 p-[20px_24px]">
        <div className="grid grid-cols-3 gap-3 mb-[18px]">
          <StatCard label="Open Tickets"     value={counts.open}      colorCls="text-brand"      iconCls="bg-[#eff6ff] text-brand"      icon="ti ti-ticket" />
          <StatCard label="Cancelled Tickets" value={counts.cancelled}  colorCls="text-[#64748b]"  iconCls="bg-[#f1f5f9] text-[#64748b]"  icon="ti ti-circle-x" />
          <StatCard label="Resolved Tickets"  value={counts.resolved}   colorCls="text-[#16a34a]"  iconCls="bg-[#f0fdf4] text-[#16a34a]"  icon="ti ti-circle-check" />
        </div>

        <div className="bg-white border border-[#e8ecf1] rounded-[10px] p-[11px_16px] flex items-center gap-[10px] flex-wrap mb-3">
          <div className="relative flex-1 min-w-[200px]">
            <i className="ti ti-search absolute left-[10px] top-1/2 -translate-y-1/2 text-[#94a3b8] text-[14px]" />
            <input
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search by ticket number..."
              className="w-full bg-[#f8fafc] border border-[#e8ecf1] rounded-[6px] pl-8 pr-3 py-[7px] text-[12px] text-[#0f172a] placeholder:text-[#94a3b8] outline-none focus:border-brand focus:bg-white transition-colors"
            />
          </div>
          <div className="w-px h-6 bg-[#e8ecf1]" />
          <span className="text-[12px] text-[#94a3b8] whitespace-nowrap">Show</span>
          <select
            value={limit}
            onChange={(e) => handleLimit(e.target.value)}
            className="bg-[#f8fafc] border border-[#e8ecf1] rounded-[6px] px-3 py-[6px] text-[12px] text-[#475569] outline-none cursor-pointer focus:border-brand"
          >
            {LIMIT_OPTIONS.map(n => <option key={n} value={n}>{n}</option>)}
          </select>
          <span className="text-[12px] text-[#94a3b8] whitespace-nowrap">entries</span>
        </div>

        <div className="bg-white border border-[#e8ecf1] rounded-[10px] overflow-hidden">
          <div className="bg-[#f8fafc] border-b border-[#e8ecf1] px-4 py-[10px] grid gap-x-3" style={{ gridTemplateColumns: '180px 140px 1fr 80px' }}>
            {[
              { label: 'Ticket #', key: 'ticket' },
              { label: 'Status' },
              { label: 'Date Reported', key: 'date' },
              { label: 'Action' },
            ].map((h) => (
              <div
                key={h.label}
                onClick={() => h.key && handleSort(h.key)}
                className={`text-[11px] font-semibold text-[#94a3b8] uppercase tracking-[0.6px] flex items-center gap-1 ${h.key ? 'cursor-pointer select-none hover:text-[#475569] transition-colors' : ''}`}
              >
                {h.label}
                {h.key && <i className={`shrink-0 text-[12px] ${sortIcon(h.key)}`} />}
              </div>
            ))}
          </div>

          {loading ? (
            <div className="py-16 text-center text-[13px] text-[#94a3b8]">Loading tickets...</div>
          ) : tickets.length === 0 ? (
            <div className="py-16 text-center text-[13px] text-[#94a3b8]">No merged tickets found.</div>
          ) : (
            tickets.map((t) => (
              <div
                key={t.ticket_id}
                className="grid gap-x-3 px-4 py-[11px] border-b border-[#f1f5f9] items-center hover:bg-[#fafbfc] transition-colors last:border-b-0"
                style={{ gridTemplateColumns: '180px 140px 1fr 80px' }}
              >
                <div
                  className="text-[12px] font-bold text-brand font-mono tracking-[0.2px] cursor-pointer hover:underline"
                  onClick={() => setActiveTicketId(t.ticket_no)}
                >
                  {t.ticket_no}
                </div>
                <div><StatusPill status={t.ticket_status} /></div>
                <div className="text-[11px] text-[#64748b] leading-[1.5]">
                  {t.created_at ? (
                    <>{dayjs(t.created_at).format('MMM D, YYYY')}<br />{dayjs(t.created_at).format('hh:mm A')}</>
                  ) : '—'}
                </div>
                <div>
                  <button
                    onClick={() => setActiveTicketId(t.ticket_no)}
                    className="w-7 h-7 rounded-[6px] bg-[#f8fafc] border border-[#e2e8f0] flex items-center justify-center text-[#94a3b8] text-[14px] hover:border-brand hover:text-brand hover:bg-[#eff6ff] transition-all"
                    title="View ticket"
                  >
                    <i className="ti ti-eye" />
                  </button>
                </div>
              </div>
            ))
          )}

          {total > 0 && (
            <div className="flex items-center justify-between px-4 py-[10px] border-t border-[#f1f5f9] bg-[#fafbfc] flex-wrap gap-2">
              <span className="text-[12px] text-[#94a3b8]">
                Showing <b className="text-[#475569]">{start}–{end}</b> of <b className="text-[#475569]">{total}</b> entries
              </span>
              {totalPages > 1 && (
                <div className="flex gap-1">
                  <button
                    onClick={() => setPage(p => p - 1)}
                    disabled={page === 1}
                    className="w-7 h-7 rounded-[6px] bg-white border border-[#e2e8f0] text-[#64748b] text-[12px] flex items-center justify-center hover:border-[#cbd5e1] hover:text-[#1e293b] disabled:opacity-40"
                  >
                    <i className="ti ti-chevron-left text-[13px]" />
                  </button>
                  {buildPageRange(page, totalPages).map((p, i) =>
                    p === '…' ? (
                      <span key={`e${i}`} className="w-7 h-7 flex items-center justify-center text-[12px] text-[#94a3b8]">…</span>
                    ) : (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`w-7 h-7 rounded-[6px] border text-[12px] flex items-center justify-center font-medium transition-colors ${p === page ? 'bg-brand border-brand text-white font-bold' : 'bg-white border-[#e2e8f0] text-[#64748b] hover:border-[#cbd5e1] hover:text-[#1e293b]'}`}
                      >
                        {p}
                      </button>
                    )
                  )}
                  <button
                    onClick={() => setPage(p => p + 1)}
                    disabled={page === totalPages}
                    className="w-7 h-7 rounded-[6px] bg-white border border-[#e2e8f0] text-[#64748b] text-[12px] flex items-center justify-center hover:border-[#cbd5e1] hover:text-[#1e293b] disabled:opacity-40"
                  >
                    <i className="ti ti-chevron-right text-[13px]" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </ScrollArea>

      {activeTicketId && (
        <MergedViewModal
          ticketId={activeTicketId}
          isIT={isIT}
          onClose={() => setActiveTicketId(null)}
        />
      )}
    </>
  );
}
