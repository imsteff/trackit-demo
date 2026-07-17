import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import ticketService from '../../../services/ticketService';
import { decodeHtmlEntities } from '../../../utils/htmlUtils';

export default function MergedViewModal({ ticketId, onClose }) {
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!ticketId) return;
    setLoading(true);
    setTicket(null);
    ticketService.getTicket(ticketId)
      .then(setTicket)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [ticketId]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (!ticketId) return null;

  return createPortal(
    <div
      className="fixed inset-0 bg-[rgba(15,23,42,0.5)] flex items-center justify-center z-50"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-[10px] w-[min(780px,95vw)] max-h-[88vh] overflow-hidden flex flex-col shadow-[0_20px_60px_rgba(0,0,0,0.18)]">
        <div className="bg-brand px-5 py-[14px] flex items-center justify-between shrink-0">
          <div className="text-[14px] font-bold text-white tracking-[-0.1px]">
            Portal Ticket #: {ticketId}
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-[6px] bg-[rgba(255,255,255,0.2)] border-none text-white flex items-center justify-center hover:bg-[rgba(255,255,255,0.35)] transition-colors cursor-pointer"
          >
            <i className="ti ti-x text-[14px]" />
          </button>
        </div>

        <div className="grid flex-1 overflow-hidden" style={{ gridTemplateColumns: '1fr 260px' }}>
          <div className="border-r border-[#e8ecf1] overflow-y-auto">
            {loading && (
              <div className="py-16 text-center text-[13px] text-[#94a3b8]">Loading...</div>
            )}
            {!loading && ticket && (
              ticket.details
                ? <div className="text-[12px] leading-relaxed overflow-x-auto" dangerouslySetInnerHTML={{ __html: decodeHtmlEntities(ticket.details) }} />
                : <div className="py-16 text-center text-[13px] text-[#94a3b8]">No details available.</div>
            )}
            {!loading && !ticket && (
              <div className="py-16 text-center text-[13px] text-[#94a3b8]">Ticket not found.</div>
            )}
          </div>

          <div className="p-5 flex flex-col gap-[10px]">
            <div className="text-[12px] font-bold text-[#475569]">Parent Ticket:</div>
            <div className="h-px bg-[#e8ecf1]" />
            {!loading && ticket?.merged_to ? (
              <>
                <button
                  onClick={() => { onClose(); navigate(`/tickets/${ticket.merged_to}`); }}
                  className="inline-flex items-center gap-[6px] text-[13px] font-bold text-[#2563eb] font-mono hover:text-[#1d4ed8] hover:underline transition-colors text-left cursor-pointer bg-transparent border-none p-0"
                >
                  <i className="ti ti-link text-[13px]" />
                  {ticket.merged_to}
                </button>
                <div className="text-[11px] text-[#94a3b8] leading-[1.5]">Click to open the parent ticket.</div>
              </>
            ) : (
              !loading && <div className="text-[12px] text-[#94a3b8]">No parent ticket linked.</div>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
