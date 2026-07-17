import { useState } from 'react';
import ScrollArea from '../../../components/common/ScrollArea';

export default function EmailReplyPanel({ ticket }) {
  const [to, setTo] = useState('');
  const [cc, setCc] = useState('');
  const [body, setBody] = useState('');

  return (
    <div className="bg-white border border-[#e8ecf1] rounded-[10px] flex flex-col h-full overflow-hidden">
      <ScrollArea className="flex-1 p-[13px_14px] flex flex-col">
        <div className="text-[11px] font-bold text-[#0f172a] mb-[10px] uppercase tracking-[0.5px] flex items-center gap-[7px] shrink-0">
          <i className="ti ti-mail text-brand text-[14px]" />
          Reply to Email Thread
        </div>
        <div className="mb-2 shrink-0">
          <label className="text-[11px] font-semibold text-[#475569] block mb-1">TO recipients *</label>
          <input
            type="text"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="w-full border border-[#e8ecf1] rounded-[6px] px-[10px] py-[6px] text-[11px] text-[#0f172a] bg-[#f8fafc] outline-none focus:border-brand focus:bg-white transition-colors"
          />
        </div>
        <div className="mb-2 shrink-0">
          <label className="text-[11px] font-semibold text-[#475569] block mb-1">CC recipients *</label>
          <input
            type="text"
            value={cc}
            onChange={(e) => setCc(e.target.value)}
            className="w-full border border-[#e8ecf1] rounded-[6px] px-[10px] py-[6px] text-[11px] text-[#0f172a] bg-[#f8fafc] outline-none focus:border-brand focus:bg-white transition-colors"
          />
        </div>
        <div className="mb-2 shrink-0">
          <label className="text-[11px] font-semibold text-[#475569] block mb-1">Message *</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Type your reply here..."
            rows={6}
            className="w-full border border-[#e8ecf1] rounded-[6px] px-[10px] py-[7px] text-[12px] text-[#0f172a] bg-[#f8fafc] outline-none focus:border-brand focus:bg-white transition-colors resize-vertical min-h-[100px]"
          />
        </div>
        <div className="text-[10px] text-red-600 leading-[1.6] mb-3 shrink-0">
          * Reminders:<br />
          1. Use comma to separate recipients. DO NOT USE SPACES.<br />
          2. Reply goes to the ticket's email thread automatically.
        </div>
        <button
          className="w-full bg-brand hover:bg-brand/90 text-white rounded-[6px] py-[8px] text-[12px] font-semibold transition-colors shrink-0"
          title="Email reply — Phase 6"
        >
          Send Reply
        </button>
      </ScrollArea>
    </div>
  );
}
