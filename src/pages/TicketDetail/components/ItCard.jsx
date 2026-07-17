import { decodeHtmlEntities } from '../../../utils/htmlUtils';

export default function ItCard({ ticket }) {
  return (
    <div className="bg-white border border-[#e8ecf1] rounded-[10px] overflow-hidden">
      <div className="px-[14px] py-[9px] text-[10px] font-bold uppercase tracking-[0.7px] text-white bg-brand border-b border-[#e8ecf1]">
        IT Helpdesk
      </div>
      {ticket.details ? (
        <div
          className="text-[12px] leading-relaxed overflow-x-auto"
          dangerouslySetInnerHTML={{ __html: decodeHtmlEntities(ticket.details) }}
        />
      ) : (
        <div className="px-4 py-6 text-[13px] text-[#94a3b8]">No details available.</div>
      )}
    </div>
  );
}
