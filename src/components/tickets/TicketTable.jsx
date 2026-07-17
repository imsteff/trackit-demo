import { useState, useCallback, useEffect } from 'react';
import TicketRow from './TicketRow';

const DEFAULTS_IT   = [105, 130, 220, 155, 120, 132, 138, 68];
const DEFAULTS_ITPD = [110, 220, 88,  160, 120, 140, 92];
const MIN_COL_W = 50;

const FLEX_IDX_IT   = 2;
const FLEX_IDX_ITPD = 1;

const HEADERS_ITPD = [
  { label: 'Ticket #',      key: 'ticket'   },
  { label: 'Subject'                         },
  { label: 'Priority'                        },
  { label: 'Assigned To',   key: 'assignee' },
  { label: 'Status'                          },
  { label: 'Date Reported', key: 'date'      },
  { label: 'Actions'                         },
];

const HEADERS_IT = [
  { label: 'Ticket #',      key: 'ticket'   },
  { label: 'Category'                        },
  { label: 'Outlet'                          },
  { label: 'Assigned To',   key: 'assignee' },
  { label: 'Status'                          },
  { label: 'Date Reported', key: 'date'      },
  { label: 'Last Update'                     },
  { label: 'Actions'                         },
];

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

function Pagination({ page, total, limit, onPageChange, onLimitChange }) {
  if (!total) return null;

  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);
  const pageRange = buildPageRange(page, totalPages);

  return (
    <div className="flex items-center justify-between px-4 py-[10px] border-t border-[#f1f5f9] bg-[#fafbfc] flex-wrap gap-2">
      <div className="flex items-center gap-3">
        <span className="text-[12px] text-[#94a3b8]">
          Showing <b className="text-[#475569]">{start}–{end}</b> of <b className="text-[#475569]">{total}</b> tickets
        </span>
        <div className="flex items-center gap-[6px]">
          <span className="text-[11px] text-[#94a3b8]">Show</span>
          <select
            value={limit}
            onChange={(e) => { onLimitChange(parseInt(e.target.value)); }}
            className="bg-white border border-[#e2e8f0] rounded-[6px] px-[8px] py-[3px] text-[12px] text-[#334155] outline-none focus:border-brand cursor-pointer"
          >
            {LIMIT_OPTIONS.map(n => <option key={n} value={n}>{n}</option>)}
          </select>
          <span className="text-[11px] text-[#94a3b8]">per page</span>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex gap-1">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
            className="w-7 h-7 rounded-[6px] bg-white border border-[#e2e8f0] text-[#64748b] text-[12px] flex items-center justify-center hover:border-[#cbd5e1] hover:text-[#1e293b] disabled:opacity-40"
          >
            <i className="ti ti-chevron-left text-[13px]" />
          </button>
          {pageRange.map((p, i) =>
            p === '…' ? (
              <span key={`e${i}`} className="w-7 h-7 flex items-center justify-center text-[12px] text-[#94a3b8]">…</span>
            ) : (
              <button
                key={p}
                onClick={() => onPageChange(p)}
                className={`w-7 h-7 rounded-[6px] border text-[12px] flex items-center justify-center font-medium transition-colors ` +
                  (p === page
                    ? 'bg-brand border-brand text-white font-bold'
                    : 'bg-white border-[#e2e8f0] text-[#64748b] hover:border-[#cbd5e1] hover:text-[#1e293b]')}
              >
                {p}
              </button>
            )
          )}
          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page === totalPages}
            className="w-7 h-7 rounded-[6px] bg-white border border-[#e2e8f0] text-[#64748b] text-[12px] flex items-center justify-center hover:border-[#cbd5e1] hover:text-[#1e293b] disabled:opacity-40"
          >
            <i className="ti ti-chevron-right text-[13px]" />
          </button>
        </div>
      )}
    </div>
  );
}

export default function TicketTable({ tickets, total, page, limit, onPageChange, onLimitChange, loading, onUpdated, isIT, sortBy, sortDir, onSort }) {
  const HEADERS  = isIT ? HEADERS_IT   : HEADERS_ITPD;
  const DEFAULTS = isIT ? DEFAULTS_IT  : DEFAULTS_ITPD;
  const FLEX_IDX = isIT ? FLEX_IDX_IT  : FLEX_IDX_ITPD;

  const [widths, setWidths] = useState(DEFAULTS);

  useEffect(() => { setWidths(isIT ? DEFAULTS_IT : DEFAULTS_ITPD); }, [isIT]);

  const gridTemplate = widths.map((w, i) =>
    i === FLEX_IDX ? `minmax(${w}px, 1fr)` : `${w}px`
  ).join(' ');
  const minWidth = widths.reduce((a, b) => a + b, 0) + 32 + (widths.length - 1) * 12;

  const startResize = useCallback((colIdx, e) => {
    e.preventDefault();
    const startX = e.clientX;
    const startW = widths[colIdx];

    document.body.style.cursor     = 'col-resize';
    document.body.style.userSelect = 'none';

    const onMove = (me) => {
      const next = [...widths];
      next[colIdx] = Math.max(MIN_COL_W, startW + (me.clientX - startX));
      setWidths(next);
    };

    const onUp = () => {
      document.body.style.cursor     = '';
      document.body.style.userSelect = '';
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup',   onUp);
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup',   onUp);
  }, [widths]);

  const handleSort = (key) => {
    if (!key || !onSort) return;
    if (sortBy === key) {
      onSort(key, sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      onSort(key, 'asc');
    }
  };

  return (
    <div
      className="bg-white border border-[#e8ecf1] rounded-[10px] overflow-x-auto scrollbar-slim"
      style={{ '--col-template': gridTemplate }}
    >
      <div style={{ minWidth }}>
        {/* Header */}
        <div
          className="bg-[#f8fafc] border-b border-[#e8ecf1] px-4 py-[10px] gap-x-3"
          style={{ display: 'grid', gridTemplateColumns: gridTemplate }}
        >
          {HEADERS.map((h, i) => (
            <div
              key={h.label}
              className={`relative text-[11px] font-semibold text-[#94a3b8] uppercase tracking-[0.6px] flex items-center gap-1 overflow-hidden ${h.key ? 'cursor-pointer select-none hover:text-[#475569] transition-colors' : ''}`}
              onClick={() => handleSort(h.key)}
            >
              <span className="truncate">{h.label}</span>
              {h.key && (
                <i className={`shrink-0 text-[12px] ${
                  sortBy === h.key
                    ? sortDir === 'asc'
                      ? 'ti ti-arrow-up text-brand'
                      : 'ti ti-arrow-down text-brand'
                    : 'ti ti-selector text-[#cbd5e1]'
                }`} />
              )}
              {i < HEADERS.length - 1 && (
                <div
                  onMouseDown={(e) => startResize(i, e)}
                  onClick={(e) => e.stopPropagation()}
                  className="absolute right-0 top-0 h-full w-[6px] cursor-col-resize z-10 group"
                >
                  <div className="absolute right-[2px] top-[20%] bottom-[20%] w-[2px] rounded-full bg-[#e2e8f0] group-hover:bg-brand transition-colors" />
                </div>
              )}
            </div>
          ))}
        </div>

        {loading ? (
          <div className="py-16 text-center text-[13px] text-[#94a3b8]">Loading tickets...</div>
        ) : tickets.length === 0 ? (
          <div className="py-16 text-center text-[13px] text-[#94a3b8]">No tickets found.</div>
        ) : (
          tickets.map(t => <TicketRow key={t.ticket_id} ticket={t} isIT={isIT} onUpdated={onUpdated} />)
        )}

        <Pagination page={page} total={total} limit={limit} onPageChange={onPageChange} onLimitChange={onLimitChange} />
      </div>
    </div>
  );
}
