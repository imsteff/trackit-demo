import { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import StatusPill from '../../../components/common/StatusPill';
import PriorityBadge from '../../../components/common/PriorityBadge';
import { useClickOutside, useDropdownPos } from '../../../hooks/useDropdown';
import ticketService from '../../../services/ticketService';

const STATUS_OPTIONS = [
  { value: 1, label: 'Waiting' },
  { value: 3, label: 'In Progress' },
  { value: 4, label: 'On Hold' },
  { value: 5, label: 'Cancelled' },
  { value: 6, label: 'Resolved' },
  { value: 10, label: 'Escalated' },
];
const IT_STATUS_OPTIONS = [...STATUS_OPTIONS, { value: 8, label: 'IT Active' }];
const PRIORITY_OPTIONS = ['P1', 'P2', 'P3'];

const CROSS_DEPT = {
  1: [
    { value: 'operations---fraud-amp-risk', label: 'Fraud & Risk' },
    { value: 'it-department', label: 'IT Team' },
  ],
  2: [
    { value: 'it-projects-development', label: 'IT Projects Dev' },
    { value: 'it-department', label: 'IT Team' },
  ],
};

function TechnicianSelect({ ticketId, assigned, deptSlug, itpdStatus, onUpdated }) {
  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const ref = useRef(null);
  const pos = useDropdownPos(open, ref);
  useClickOutside(ref, () => setOpen(false));

  const openDropdown = async () => {
    setOpen(true);
    if (users.length > 0) return;
    setLoading(true);
    try { const list = await ticketService.getUsers(deptSlug); setUsers(list); }
    catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleSelect = async (value) => {
    setSaving(true);
    try { await ticketService.assignTicket(ticketId, value); onUpdated(); }
    catch (err) { console.error(err); }
    finally { setSaving(false); setOpen(false); }
  };

  const crossDept = CROSS_DEPT[itpdStatus] || [];

  return (
    <div>
      <button
        ref={ref}
        onClick={openDropdown}
        disabled={saving}
        className="bg-[#f8fafc] border border-[#e8ecf1] rounded-[6px] px-[10px] py-[5px] text-[12px] text-[#0f172a] min-w-[140px] flex items-center gap-1 hover:border-brand transition-colors disabled:opacity-60 outline-none"
      >
        <span className="flex-1 truncate text-left">{assigned || 'Unassigned'}</span>
        <i className="ti ti-chevron-down text-[10px] text-[#94a3b8] shrink-0" />
      </button>
      {open && createPortal(
        <div
          style={{ position: 'fixed', top: pos.top, left: pos.left, zIndex: 9999 }}
          className="bg-white border border-[#e2e8f0] rounded-[8px] shadow-lg overflow-hidden min-w-[200px] max-h-[260px] overflow-y-auto scrollbar-slim"
        >
          {loading ? (
            <div className="px-3 py-3 text-[12px] text-[#94a3b8]">Loading...</div>
          ) : (
            <>
              <button
                onMouseDown={(e) => { e.preventDefault(); handleSelect(''); }}
                className={`w-full flex items-center gap-2 px-3 py-[8px] text-[12px] hover:bg-[#f8fafc] transition-colors ${!assigned ? 'bg-[#eff6ff] text-brand font-medium' : 'text-[#334155]'}`}
              >
                <i className="ti ti-user text-[#94a3b8]" style={{ fontSize: 11 }} />
                Unassigned
                {!assigned && <i className="ti ti-check text-brand text-[11px] ml-auto" />}
              </button>
              {users.map(u => (
                <button
                  key={u.value}
                  onMouseDown={(e) => { e.preventDefault(); handleSelect(u.value); }}
                  className={`w-full flex items-center gap-2 px-3 py-[8px] text-[12px] hover:bg-[#f8fafc] transition-colors ${assigned === u.value ? 'bg-[#eff6ff] text-brand font-medium' : 'text-[#334155]'}`}
                >
                  <div className="w-4 h-4 rounded-full bg-[#eff6ff] border border-[#bfdbfe] flex items-center justify-center text-[7px] font-bold text-brand shrink-0">
                    {u.label.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()}
                  </div>
                  {u.label}
                  {assigned === u.value && <i className="ti ti-check text-brand text-[11px] ml-auto" />}
                </button>
              ))}
              {crossDept.length > 0 && (
                <>
                  <div className="mx-3 my-1 border-t border-[#f1f5f9]" />
                  <div className="px-3 py-1 text-[10px] font-semibold text-[#94a3b8] uppercase tracking-[0.5px]">Transfer to Dept</div>
                  {crossDept.map(d => (
                    <button
                      key={d.value}
                      onMouseDown={(e) => { e.preventDefault(); handleSelect(d.value); }}
                      className="w-full flex items-center gap-2 px-3 py-[8px] text-[12px] text-[#334155] hover:bg-[#f8fafc] transition-colors"
                    >
                      <div className="w-4 h-4 rounded-full bg-[#eff6ff] border border-[#bfdbfe] flex items-center justify-center shrink-0">
                        <i className="ti ti-building text-blue-500" style={{ fontSize: 9 }} />
                      </div>
                      {d.label}
                    </button>
                  ))}
                </>
              )}
            </>
          )}
        </div>,
        document.body
      )}
    </div>
  );
}

export default function TicketTopbar({ ticket, isAdmin, user, priority, onUpdated }) {
  const navigate = useNavigate();
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [priorityUpdating, setPriorityUpdating] = useState(false);

  const isIT = ticket.itpd_status === 0;
  const statusOptions = isIT ? IT_STATUS_OPTIONS : STATUS_OPTIONS;

  const handleStatusChange = async (e) => {
    const newStatus = parseInt(e.target.value);
    if (!newStatus || newStatus === ticket.ticket_status) return;
    setStatusUpdating(true);
    try { await ticketService.updateStatus(ticket.ticket_no, newStatus); onUpdated(); }
    catch (err) { console.error(err); }
    finally { setStatusUpdating(false); }
  };

  const handlePriorityChange = async (e) => {
    const p = e.target.value;
    if (!p || p === priority) return;
    setPriorityUpdating(true);
    try { await ticketService.updatePriority(ticket.ticket_no, p); onUpdated(); }
    catch (err) { console.error(err); }
    finally { setPriorityUpdating(false); }
  };

  return (
    <div className="bg-white border-b border-[#e8ecf1] px-6 py-[14px] flex items-start justify-between gap-4 shrink-0">
      {/* Left */}
      <div className="flex flex-col gap-[5px]">
        <button
          onClick={() => navigate('/tickets')}
          className="inline-flex items-center gap-[5px] text-[11px] text-[#94a3b8] px-[10px] py-[4px] rounded-[5px] border border-[#e8ecf1] bg-[#f8fafc] w-fit hover:border-brand hover:text-brand transition-all"
        >
          <i className="ti ti-arrow-left text-[12px]" />
          Back to Tickets
        </button>
        <div className="flex items-center gap-[10px]">
          <div className="text-[17px] font-bold text-[#0f172a] tracking-[-0.3px]">
            Ticket: <span className="text-brand">{ticket.ticket_no}</span>
          </div>
          {!isIT && <PriorityBadge priority={priority} />}
          <StatusPill status={ticket.ticket_status} />
        </div>
        <div className="text-[11px] text-[#94a3b8] leading-[1.8]">
          Date Reported: <b className="text-[#64748b]">{ticket.created_at ? dayjs(ticket.created_at).format('MMM D, YYYY hh:mm:ss A') : '—'}</b>
          {' · '}
          Last Update: <b className="text-[#64748b]">{ticket.modified_at ? dayjs(ticket.modified_at).format('MMM D, YYYY hh:mm:ss A') : '—'}</b>
        </div>
      </div>

      {/* Right — admin controls */}
      {isAdmin && (
        <div className="flex items-center gap-[10px] flex-wrap justify-end shrink-0">
          <div className="flex items-center gap-[6px]">
            <span className="text-[11px] text-[#475569] font-medium whitespace-nowrap">Status:</span>
            <select
              value={ticket.ticket_status}
              onChange={handleStatusChange}
              disabled={statusUpdating}
              className="bg-[#f8fafc] border border-[#e8ecf1] rounded-[6px] px-[10px] py-[5px] text-[12px] text-[#0f172a] outline-none focus:border-brand transition-colors disabled:opacity-60 cursor-pointer"
            >
              {statusOptions.map(s => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>

          {!isIT && (
            <div className="flex items-center gap-[6px]">
              <span className="text-[11px] text-[#475569] font-medium whitespace-nowrap">Priority:</span>
              <select
                value={priority}
                onChange={handlePriorityChange}
                disabled={priorityUpdating}
                className="bg-[#f8fafc] border border-[#e8ecf1] rounded-[6px] px-[10px] py-[5px] text-[12px] text-[#0f172a] outline-none focus:border-brand transition-colors disabled:opacity-60 cursor-pointer"
              >
                {PRIORITY_OPTIONS.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
          )}

          <div className="flex items-center gap-[6px]">
            <span className="text-[11px] text-[#475569] font-medium whitespace-nowrap">Technician:</span>
            <TechnicianSelect
              ticketId={ticket.ticket_no}
              assigned={ticket.assigned_to}
              deptSlug={user?.dept_slug}
              itpdStatus={ticket.itpd_status}
              onUpdated={onUpdated}
            />
          </div>
        </div>
      )}
    </div>
  );
}
