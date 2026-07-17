import { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTicket } from '../../hooks/useTickets';
import { useAuth } from '../../context/AuthContext';
import TicketTopbar from './components/TicketTopbar';
import TicketTabs from './components/TicketTabs';
import ItCard from './components/ItCard';
import ItpdCard from './components/ItpdCard';
import MergeJiraPanel from './components/MergeJiraPanel';
import NotesPanel from './components/NotesPanel';
import ChatThread from './components/ChatThread';
import EmailReplyPanel from './components/EmailReplyPanel';

export default function TicketDetailPage() {
  const { ticketId } = useParams();
  const { user } = useAuth();
  const { ticket, loading, error, refetch } = useTicket(ticketId);
  const [activeTab, setActiveTab] = useState('details');

  // Measure IT card height so Merge/JIRA and Notes panels match it exactly
  const itCardRef = useRef(null);
  const [sideColHeight, setSideColHeight] = useState(null);

  useEffect(() => {
    const el = itCardRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      setSideColHeight(entry.contentRect.height);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [ticket]);

  const isAdmin = user?.role?.toLowerCase() === 'admin';

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center text-[13px] text-[#94a3b8]">
        Loading ticket...
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="flex-1 flex items-center justify-center text-[13px] text-[#94a3b8]">
        {error || 'Ticket not found.'}
      </div>
    );
  }

  const isIT = ticket.itpd_status === 0;
  const priority = (ticket.helpdesk?.priority || 'P3').replace(/[\[\]]/g, '');
  const chats = ticket.chats || [];
  const sideStyle = sideColHeight ? { height: sideColHeight } : {};

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <TicketTopbar
        ticket={ticket}
        isAdmin={isAdmin}
        user={user}
        priority={priority}
        onUpdated={refetch}
      />
      <TicketTabs activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === 'details' ? (
        <div className="flex-1 overflow-hidden flex flex-col gap-[14px] p-[16px_24px]">
          {/* Top panel — col 1 drives height, cols 2+3 sync to it */}
          <div className="grid gap-[12px] items-start shrink-0" style={{ gridTemplateColumns: '1fr 1fr 320px' }}>
            <div ref={itCardRef}>
              {isIT ? <ItCard ticket={ticket} /> : <ItpdCard ticket={ticket} />}
            </div>
            <div style={sideStyle}>
              <MergeJiraPanel ticket={ticket} isAdmin={isAdmin} onUpdated={refetch} />
            </div>
            <div style={sideStyle}>
              <NotesPanel ticket={ticket} isAdmin={isAdmin} currentUser={user?.name} onUpdated={refetch} />
            </div>
          </div>

          {/* Bottom panel — fills remaining height, panels scroll internally */}
          <div className="flex-1 min-h-0 pb-[16px]">
            <div className="grid gap-[12px] h-full" style={{ gridTemplateColumns: '1fr 320px' }}>
              <ChatThread chats={chats} currentUser={user} />
              <EmailReplyPanel ticket={ticket} />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-[13px] text-[#94a3b8]">
          — in dev
        </div>
      )}
    </div>
  );
}
