import { useState } from 'react';
import ticketService from '../../../services/ticketService';
import ScrollArea from '../../../components/common/ScrollArea';

function formatTrackDate(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (isNaN(d)) return null;
  return d.toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function JiraLinks({ raw, isAdmin, onRemove }) {
  if (!raw?.trim()) return null;
  const links = raw.split(',').map(l => l.trim()).filter(Boolean);
  return (
    <div className="flex flex-col gap-[4px]">
      {links.map((link, i) => (
        <div key={i} className="flex items-center gap-[4px] group">
          <a
            href={link.startsWith('http') ? link : `https://${link}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] text-blue-600 hover:underline truncate flex-1 min-w-0"
          >
            {link}
          </a>
          {isAdmin && (
            <button
              onClick={() => onRemove(link)}
              className="shrink-0 text-[#cbd5e1] hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
              title="Remove link"
            >
              <i className="ti ti-x text-[11px]" />
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

export default function MergeJiraPanel({ ticket, isAdmin, onUpdated }) {
  const [mergeId, setMergeId] = useState('');
  const [merging, setMerging] = useState(false);
  const [newJira, setNewJira] = useState('');
  const [savingJira, setSavingJira] = useState(false);

  const savedJira = ticket.jira_ticket?.trim();
  const hasJiraTracking = ticket.jira_by || ticket.jira_at;

  const handleMerge = async () => {
    if (!mergeId.trim()) return;
    if (!window.confirm(`Merge ticket ${ticket.ticket_no} into ${mergeId.trim()}?`)) return;
    setMerging(true);
    try {
      await ticketService.mergeTicket(ticket.ticket_no, mergeId.trim());
      onUpdated();
      setMergeId('');
    } catch (err) { console.error(err); }
    finally { setMerging(false); }
  };

  const handleJiraRemove = async (link) => {
    if (!window.confirm(`Remove "${link}"?`)) return;
    try {
      await ticketService.removeJiraLink(ticket.ticket_no, link);
      onUpdated();
    } catch (err) { console.error(err); }
  };

  const handleJiraSave = async () => {
    if (!newJira.trim()) return;
    setSavingJira(true);
    try {
      await ticketService.addJiraLink(ticket.ticket_no, newJira);
      onUpdated();
      setNewJira('');
    } catch (err) { console.error(err); }
    finally { setSavingJira(false); }
  };

  return (
    <div className="flex flex-col gap-[10px] h-full">
      {/* Merge sub-card — half the height */}
      <div className="bg-white border border-[#e8ecf1] rounded-[10px] p-[13px_14px] flex-1 flex flex-col overflow-hidden">
        <div className="text-[11px] font-bold text-[#475569] mb-2 flex items-center gap-[6px] uppercase tracking-[0.5px]">
          <i className="ti ti-list text-[14px] opacity-60" />
          Merge Ticket
        </div>
        {isAdmin && (
          <div className="shrink-0">
            <div className="mb-2">
              <label className="text-[11px] font-semibold text-[#475569] block mb-1">Add Parent Portal ID of Child Ticket</label>
              <input
                type="text"
                placeholder="e.g. TKT-24100"
                value={mergeId}
                onChange={(e) => setMergeId(e.target.value)}
                className="w-full border border-[#e8ecf1] rounded-[6px] px-[10px] py-[7px] text-[12px] text-[#0f172a] bg-[#f8fafc] outline-none focus:border-brand focus:bg-white transition-colors"
              />
            </div>
            <button
              onClick={handleMerge}
              disabled={merging || !mergeId.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-[6px] py-[8px] text-[12px] font-semibold transition-colors disabled:opacity-50 mt-1"
            >
              {merging ? 'Merging...' : 'Merge'}
            </button>
            <div className="text-[10px] text-[#94a3b8] mt-[6px]">Note: Merging is one at a time. There is no unmerging.</div>
          </div>
        )}
        {/* spacer pushes the status line to the bottom */}
        <div className="flex-1" />
        <div className="text-[12px] text-[#94a3b8] pt-2 border-t border-[#f0f2f5] mt-2 shrink-0">
          Merged Ticket(s): <span className="text-[#475569] font-medium">{ticket.merged_to || 'N/A'}</span>
        </div>
      </div>

      {/* JIRA sub-card — fills remaining height, links scroll inside */}
      <div className="bg-white border border-[#e8ecf1] rounded-[10px] p-[13px_14px] flex-1 flex flex-col overflow-hidden min-h-0">
        <div className="text-[11px] font-bold text-[#475569] mb-2 flex items-center gap-[6px] uppercase tracking-[0.5px] shrink-0">
          <i className="ti ti-stack-2 text-[14px] opacity-60" />
          JIRA Link
        </div>

        {/* Saved links — scrollable */}
        <ScrollArea className="flex-1 min-h-0">
          {savedJira ? (
            <>
              <JiraLinks raw={savedJira} isAdmin={isAdmin} onRemove={handleJiraRemove} />
              {hasJiraTracking && (
                <div className="text-[10px] text-[#94a3b8] mt-2">
                  {ticket.jira_by && (
                    <>Last updated by <span className="font-medium text-[#64748b]">{ticket.jira_by}</span></>
                  )}
                  {ticket.jira_at && (
                    <> on <span className="font-medium text-[#64748b]">{formatTrackDate(ticket.jira_at)}</span></>
                  )}
                </div>
              )}
            </>
          ) : (
            !isAdmin && (
              <div className="text-[12px] text-[#94a3b8] italic">No JIRA link added.</div>
            )
          )}
        </ScrollArea>

        {/* Input pinned at bottom */}
        {isAdmin && (
          <div className="shrink-0 pt-2 mt-1 border-t border-[#f0f2f5]">
            <input
              type="text"
              placeholder="Add JIRA link(s)..."
              value={newJira}
              onChange={(e) => setNewJira(e.target.value)}
              className="w-full border border-[#e8ecf1] rounded-[6px] px-[10px] py-[7px] text-[12px] text-[#0f172a] bg-[#f8fafc] outline-none focus:border-brand focus:bg-white transition-colors"
            />
            <div className="text-[10px] text-[#94a3b8] mt-1 mb-2">Separate multiple links with a comma</div>
            <button
              onClick={handleJiraSave}
              disabled={savingJira || !newJira.trim()}
              className="w-full bg-brand hover:bg-brand/90 text-white rounded-[6px] py-[8px] text-[12px] font-semibold transition-colors disabled:opacity-50"
            >
              {savingJira ? 'Saving...' : 'Add Link'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
