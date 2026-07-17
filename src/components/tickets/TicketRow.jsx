import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { useAuth } from '../../context/AuthContext';
import PriorityBadge from '../common/PriorityBadge';
import StatusPill from '../common/StatusPill';
import ticketService from '../../services/ticketService';

const PRIORITY_OPTIONS = ['P1', 'P2', 'P3'];

function CategoryCell({ ticket, isAdmin, onUpdated }) {
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [saving, setSaving] = useState(false);
  const ref = useRef(null);
  const pos = useDropdownPos(open, ref);

  useClickOutside(ref, () => setOpen(false));

  useEffect(() => {
    ticketService.getCategories().then(setCategories).catch(console.error);
  }, []);

  const openDropdown = () => { if (isAdmin) setOpen(true); };

  const handleSelect = async (catId) => {
    if (catId === ticket.cat_id) { setOpen(false); return; }
    setSaving(true);
    try {
      await ticketService.updateCategory(ticket.ticket_no, catId);
      onUpdated();
    } catch (err) { console.error(err); }
    finally { setSaving(false); setOpen(false); }
  };

  const current = categories.find(c => c.cat_id === ticket.cat_id);
  const label = current?.cat_name || (ticket.cat_id ? `Cat ${ticket.cat_id}` : 'Uncategorized');

  return (
    <div>
      <button
        ref={ref}
        onClick={openDropdown}
        disabled={saving}
        className={`flex items-center gap-1 w-full text-left ${isAdmin ? 'cursor-pointer group' : 'cursor-default'} disabled:opacity-60`}
      >
        <span className="text-[12px] text-[#475569] truncate">{label}</span>
        {isAdmin && <i className="ti ti-chevron-down text-[10px] text-[#94a3b8] group-hover:text-brand transition-colors shrink-0" />}
      </button>

      {open && createPortal(
        <div
          style={{ position: 'fixed', top: pos.top, left: pos.left, zIndex: 9999 }}
          className="bg-white border border-[#e2e8f0] rounded-[8px] shadow-lg overflow-hidden min-w-[170px] max-h-[240px] overflow-y-auto scrollbar-slim"
        >
          {categories.length === 0 ? (
            <div className="px-3 py-3 text-[12px] text-[#94a3b8]">Loading...</div>
          ) : (
            <>
              <button
                onMouseDown={(e) => { e.preventDefault(); handleSelect(null); }}
                className={`w-full flex items-center gap-2 px-3 py-[7px] text-[12px] hover:bg-[#f8fafc] transition-colors ${!ticket.cat_id ? 'bg-[#eff6ff] text-brand font-medium' : 'text-[#334155]'}`}
              >
                Uncategorized
                {!ticket.cat_id && <i className="ti ti-check text-brand text-[11px] ml-auto" />}
              </button>
              {categories.map(c => (
                <button
                  key={c.cat_id}
                  onMouseDown={(e) => { e.preventDefault(); handleSelect(c.cat_id); }}
                  className={`w-full flex items-center gap-2 px-3 py-[7px] text-[12px] hover:bg-[#f8fafc] transition-colors ${ticket.cat_id === c.cat_id ? 'bg-[#eff6ff] text-brand font-medium' : 'text-[#334155]'}`}
                >
                  {c.cat_name}
                  {ticket.cat_id === c.cat_id && <i className="ti ti-check text-brand text-[11px] ml-auto" />}
                </button>
              ))}
            </>
          )}
        </div>,
        document.body
      )}
    </div>
  );
}

const ROW_STYLE = { gridTemplateColumns: 'var(--col-template)' };

const CROSS_DEPT = {
  1: [
    { value: 'operations---fraud-amp-risk', label: 'Fraud & Risk', dept: true },
    { value: 'it-department', label: 'IT Team', dept: true },
  ],
  2: [
    { value: 'it-projects-development', label: 'IT Projects Dev', dept: true },
    { value: 'it-department', label: 'IT Team', dept: true },
  ],
};

function useClickOutside(ref, handler) {
  useEffect(() => {
    const listener = (e) => { if (ref.current && !ref.current.contains(e.target)) handler(); };
    document.addEventListener('mousedown', listener);
    return () => document.removeEventListener('mousedown', listener);
  }, [ref, handler]);
}

function useDropdownPos(open, triggerRef) {
  const [pos, setPos] = useState({ top: 0, left: 0 });
  useEffect(() => {
    if (open && triggerRef.current) {
      const r = triggerRef.current.getBoundingClientRect();
      setPos({ top: r.bottom + 4, left: r.left });
    }
  }, [open]);
  return pos;
}

function PriorityCell({ ticket, isAdmin, onUpdated }) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const ref = useRef(null);
  const pos = useDropdownPos(open, ref);
  const priority = (ticket.helpdesk?.priority || 'P3').replace(/[\[\]]/g, '');

  useClickOutside(ref, () => setOpen(false));

  const handleSelect = async (p) => {
    if (p === priority) { setOpen(false); return; }
    setSaving(true);
    try {
      await ticketService.updatePriority(ticket.ticket_no, p);
      onUpdated();
    } catch (err) { console.error(err); }
    finally { setSaving(false); setOpen(false); }
  };

  if (!isAdmin) return <PriorityBadge priority={priority} />;

  return (
    <div className="relative inline-block">
      <button
        ref={ref}
        onClick={() => setOpen(o => !o)}
        disabled={saving}
        className="flex items-center gap-1 group disabled:opacity-60"
        title="Change priority"
      >
        <PriorityBadge priority={priority} />
        <i className="ti ti-chevron-down text-[10px] text-[#94a3b8] group-hover:text-brand transition-colors" />
      </button>
      {open && createPortal(
        <div
          style={{ position: 'fixed', top: pos.top, left: pos.left, zIndex: 9999 }}
          className="bg-white border border-[#e2e8f0] rounded-[8px] shadow-lg overflow-hidden min-w-[80px]"
        >
          {PRIORITY_OPTIONS.map(p => (
            <button
              key={p}
              onMouseDown={(e) => { e.preventDefault(); handleSelect(p); }}
              className={`w-full flex items-center gap-2 px-3 py-[7px] text-[12px] font-medium hover:bg-[#f8fafc] transition-colors ${p === priority ? 'bg-[#eff6ff] text-brand' : 'text-[#334155]'}`}
            >
              <PriorityBadge priority={p} />
              {p === priority && <i className="ti ti-check text-brand text-[11px] ml-auto" />}
            </button>
          ))}
        </div>,
        document.body
      )}
    </div>
  );
}

function AssigneeCell({ ticket, isAdmin, deptSlug, itpdStatus, onUpdated }) {
  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [saving, setSaving] = useState(false);
  const ref = useRef(null);
  const pos = useDropdownPos(open, ref);

  useClickOutside(ref, () => setOpen(false));

  const openDropdown = async () => {
    if (!isAdmin) return;
    setOpen(true);
    if (users.length > 0) return;
    setLoadingUsers(true);
    try {
      const list = await ticketService.getUsers(deptSlug);
      setUsers(list);
    } catch (err) { console.error(err); }
    finally { setLoadingUsers(false); }
  };

  const handleSelect = async (value) => {
    setSaving(true);
    try {
      await ticketService.assignTicket(ticket.ticket_no, value);
      onUpdated();
    } catch (err) { console.error(err); }
    finally { setSaving(false); setOpen(false); }
  };

  const name = ticket.assigned_to;
  const initials = name ? name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() : null;

  const crossDept = CROSS_DEPT[itpdStatus] || [];

  return (
    <div>
      <button
        ref={ref}
        onClick={openDropdown}
        disabled={saving}
        className={`flex items-center gap-[7px] w-full text-left ${isAdmin ? 'cursor-pointer group' : 'cursor-default'} disabled:opacity-60`}
      >
        {name ? (
          <>
            <div className="w-[22px] h-[22px] rounded-full bg-[#eff6ff] border-[1.5px] border-[#bfdbfe] flex items-center justify-center text-[9px] font-bold text-brand shrink-0">
              {initials}
            </div>
            <span className="text-[12px] text-[#475569] truncate">{name}</span>
          </>
        ) : (
          <>
            <div className="w-[22px] h-[22px] rounded-full bg-[#f1f5f9] flex items-center justify-center shrink-0">
              <i className="ti ti-user text-[#94a3b8]" style={{ fontSize: 10 }} />
            </div>
            <span className="text-[12px] text-[#475569]">Unassigned</span>
          </>
        )}
        {isAdmin && <i className="ti ti-chevron-down text-[10px] text-[#94a3b8] group-hover:text-brand transition-colors shrink-0" />}
      </button>

      {open && createPortal(
        <div
          style={{ position: 'fixed', top: pos.top, left: pos.left, zIndex: 9999 }}
          className="bg-white border border-[#e2e8f0] rounded-[8px] shadow-lg overflow-hidden min-w-[190px] max-h-[240px] overflow-y-auto scrollbar-slim"
        >
          {loadingUsers ? (
            <div className="px-3 py-3 text-[12px] text-[#94a3b8]">Loading...</div>
          ) : (
            <>
              <button
                onMouseDown={(e) => { e.preventDefault(); handleSelect(''); }}
                className={`w-full flex items-center gap-2 px-3 py-[7px] text-[12px] hover:bg-[#f8fafc] transition-colors ${!name ? 'bg-[#eff6ff] text-brand font-medium' : 'text-[#334155]'}`}
              >
                <div className="w-5 h-5 rounded-full bg-[#f1f5f9] flex items-center justify-center shrink-0">
                  <i className="ti ti-user text-[#94a3b8]" style={{ fontSize: 9 }} />
                </div>
                Unassigned
                {!name && <i className="ti ti-check text-brand text-[11px] ml-auto" />}
              </button>

              {users.map(u => (
                <button
                  key={u.value}
                  onMouseDown={(e) => { e.preventDefault(); handleSelect(u.value); }}
                  className={`w-full flex items-center gap-2 px-3 py-[7px] text-[12px] hover:bg-[#f8fafc] transition-colors ${ticket.assigned_to === u.value ? 'bg-[#eff6ff] text-brand font-medium' : 'text-[#334155]'}`}
                >
                  <div className="w-5 h-5 rounded-full bg-[#eff6ff] border border-[#bfdbfe] flex items-center justify-center text-[8px] font-bold text-brand shrink-0">
                    {u.label.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()}
                  </div>
                  {u.label}
                  {ticket.assigned_to === u.value && <i className="ti ti-check text-brand text-[11px] ml-auto" />}
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
                      className="w-full flex items-center gap-2 px-3 py-[7px] text-[12px] text-[#334155] hover:bg-[#f8fafc] transition-colors"
                    >
                      <div className="w-5 h-5 rounded-full bg-[#eff6ff] border border-[#bfdbfe] flex items-center justify-center shrink-0">
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

export default function TicketRow({ ticket, isIT, onUpdated }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [resolving, setResolving] = useState(false);

  const isAdmin = user?.role?.toLowerCase() === 'admin';
  const subject = (() => {
    const raw = ticket.helpdesk?.subject || ticket.subject;
    if (raw) {
      const ta = document.createElement('textarea');
      ta.innerHTML = raw;
      const decoded = ta.value;
      if (!decoded.trim().startsWith('<')) return decoded.trim() || null;
      const tmp = document.createElement('div');
      tmp.innerHTML = decoded;
      const th = tmp.querySelector('th');
      if (th?.textContent?.trim()) return th.textContent.trim();
      const text = (tmp.textContent || '').replace(/\s+/g, ' ').trim();
      return text.slice(0, 80) || null;
    }
    const fallbacks = [ticket.helpdesk?.description, ticket.details];
    for (const src of fallbacks) {
      if (src) {
        const plain = src.replace(/<[^>]+>/g, ' ').replace(/&[a-z]+;/gi, ' ').replace(/\s+/g, ' ').trim();
        if (plain) return plain.slice(0, 80);
      }
    }
    return '—';
  })();

  const handleResolve = async () => {
    if (!window.confirm(`Resolve ticket ${ticket.ticket_no}?`)) return;
    setResolving(true);
    try {
      await ticketService.updateStatus(ticket.ticket_no, 6);
      onUpdated();
    } catch (err) { console.error(err); }
    finally { setResolving(false); }
  };

  const actionCell = (
    <div className="flex gap-[5px]">
      {isAdmin && ticket.ticket_status !== 6 && ticket.ticket_status !== 5 && (
        <button
          onClick={handleResolve}
          disabled={resolving}
          title="Resolve ticket"
          className="w-7 h-7 rounded-[6px] bg-[#eff6ff] border border-[#bfdbfe] flex items-center justify-center text-brand text-[14px] hover:bg-brand hover:border-brand hover:text-white transition-all disabled:opacity-50"
        >
          <i className="ti ti-circle-check" />
        </button>
      )}
      <button
        onClick={() => navigate(`/tickets/${ticket.ticket_no}`)}
        className="w-7 h-7 rounded-[6px] bg-[#f8fafc] border border-[#e2e8f0] flex items-center justify-center text-[#94a3b8] text-[14px] hover:border-brand hover:text-brand hover:bg-[#eff6ff] transition-all"
        title="View ticket"
      >
        <i className="ti ti-eye" />
      </button>
    </div>
  );

  const ticketCell = (
    <div
      className="text-[12px] font-bold text-brand font-mono tracking-[0.2px] cursor-pointer hover:underline"
      onClick={() => navigate(`/tickets/${ticket.ticket_no}`)}
    >
      {ticket.ticket_no}
    </div>
  );

  const assigneeCell = (
    <AssigneeCell
      ticket={ticket}
      isAdmin={isAdmin}
      deptSlug={user?.dept_slug}
      itpdStatus={user?.itpd_status}
      onUpdated={onUpdated}
    />
  );

  const statusCell = <StatusPill status={ticket.ticket_status} />;

  const dateReportedCell = (
    <div className="text-[11px] text-[#64748b] leading-[1.5]">
      {ticket.created_at ? (
        <>{dayjs(ticket.created_at).format('MMM D, YYYY')}<br />{dayjs(ticket.created_at).format('hh:mm A')}</>
      ) : '—'}
    </div>
  );

  if (isIT) {
    const updatedAt = ticket.modified_at || ticket.created_at;
    return (
      <div className="grid gap-x-3 px-4 py-[11px] border-b border-[#f1f5f9] items-center hover:bg-[#fafbfc] transition-colors last:border-b-0" style={ROW_STYLE}>
        {ticketCell}

        {/* Category */}
        <CategoryCell ticket={ticket} isAdmin={isAdmin} onUpdated={onUpdated} />

        {/* Outlet */}
        <div className="pr-4 cursor-pointer" onClick={() => navigate(`/tickets/${ticket.ticket_no}`)}>
          <div className="text-[13px] font-medium text-[#0f172a] truncate">{ticket.outlet_name || ticket.outlet_code || '—'}</div>
          {ticket.outlet_code && <div className="text-[11px] text-[#94a3b8] mt-[2px]">{ticket.outlet_code}</div>}
        </div>

        {assigneeCell}
        {statusCell}
        {dateReportedCell}

        {/* Last Update */}
        <div className="text-[11px] text-[#64748b] leading-[1.5]">
          {updatedAt ? (
            <>{dayjs(updatedAt).format('MMM D, YYYY')}<br />{dayjs(updatedAt).format('hh:mm A')}</>
          ) : '—'}
        </div>

        {actionCell}
      </div>
    );
  }

  return (
    <div className="grid gap-x-3 px-4 py-[11px] border-b border-[#f1f5f9] items-center hover:bg-[#fafbfc] transition-colors last:border-b-0" style={ROW_STYLE}>
      {ticketCell}

      {/* Subject */}
      <div className="pr-4 cursor-pointer" onClick={() => navigate(`/tickets/${ticket.ticket_no}`)}>
        <div className="text-[13px] font-medium text-[#0f172a] truncate">{subject}</div>
        <div className="text-[11px] text-[#94a3b8] mt-[2px]">
          Updated {ticket.modified_at ? dayjs(ticket.modified_at).format('MMM D, YYYY') : '—'}
        </div>
      </div>

      <div><PriorityCell ticket={ticket} isAdmin={isAdmin} onUpdated={onUpdated} /></div>
      {assigneeCell}
      {statusCell}
      {dateReportedCell}
      {actionCell}
    </div>
  );
}
