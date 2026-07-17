import { Link } from 'react-router-dom';
import StatusPill from '../common/StatusPill';
import PriorityBadge from '../common/PriorityBadge';
import Pagination from '../common/Pagination';
import { getPlainSubject } from '../../utils/htmlUtils';
import { formatDateTime } from '../../utils/formatDate';
import { resolutionTime } from '../../utils/formatDuration';

const HEADERS = ['Ticket', 'Outlet', 'Subject', 'Priority', 'Status', 'Date Reported', 'Last Update', 'Closed By', 'Resolved By', 'Date Resolved', 'Resolution Time'];

const subjectOf = (t) => getPlainSubject(t.helpdesk?.subject || t.subject);
const dateOr = (d) => (d ? formatDateTime(d) : '—');

const thCls = 'text-left font-semibold text-[#64748b] text-[11px] uppercase tracking-wide px-3 py-[10px] whitespace-nowrap';
const tdCls = 'px-3 py-[10px] text-[13px] text-[#334155] whitespace-nowrap';

export default function ReportTable({ tickets, total, page, limit, loading, onPageChange }) {
  return (
    <div className="bg-white border border-[#e8ecf1] rounded-[10px] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-[#e8ecf1] bg-[#f8fafc]">
              {HEADERS.map((h) => <th key={h} className={thCls}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={HEADERS.length} className="text-center py-10 text-[#94a3b8] text-[13px]">Loading...</td></tr>
            ) : tickets.length === 0 ? (
              <tr><td colSpan={HEADERS.length} className="text-center py-10 text-[#94a3b8] text-[13px]">No tickets found</td></tr>
            ) : (
              tickets.map((t) => (
                <tr key={t.ticket_id} className="border-b border-[#f1f5f9] hover:bg-[#f8fafc]">
                  <td className={tdCls}>
                    <Link to={`/tickets/${t.ticket_no}`} className="text-brand font-medium hover:underline">{t.ticket_no}</Link>
                  </td>
                  <td className={tdCls}>{t.outlet_name || '—'}</td>
                  <td className={`${tdCls} max-w-[240px] truncate`} title={subjectOf(t)}>{subjectOf(t)}</td>
                  <td className={tdCls}><PriorityBadge priority={t.helpdesk?.priority} /></td>
                  <td className={tdCls}><StatusPill status={t.ticket_status} /></td>
                  <td className={tdCls}>{dateOr(t.created_at)}</td>
                  <td className={tdCls}>{dateOr(t.modified_at)}</td>
                  <td className={tdCls}>{t.modified_by || '—'}</td>
                  <td className={tdCls}>{t.resolved_by || '—'}</td>
                  <td className={tdCls}>{dateOr(t.resolved_date)}</td>
                  <td className={tdCls}>{resolutionTime(t.created_at, t.resolved_date || t.modified_at)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="px-3 py-2 border-t border-[#e8ecf1] flex items-center justify-between">
        <span className="text-[12px] text-[#94a3b8]">{total} ticket{total === 1 ? '' : 's'}</span>
        <Pagination page={page} total={total} limit={limit} onChange={onPageChange} />
      </div>
    </div>
  );
}
