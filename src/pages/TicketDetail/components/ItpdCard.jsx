import dayjs from 'dayjs';
import PriorityBadge from '../../../components/common/PriorityBadge';
import { decodeHtmlEntities } from '../../../utils/htmlUtils';

const BRAND = '#2563eb';

function FieldRow({ label, children }) {
  return (
    <tr style={{ borderBottom: '1px solid #f0f2f5' }}>
      <td style={{ width: '42%', padding: '7px 12px', fontSize: 12, verticalAlign: 'top', background: '#f8fafc', color: '#475569', fontWeight: 500, whiteSpace: 'nowrap' }}>
        {label}
      </td>
      <td style={{ padding: '7px 12px', fontSize: 12, verticalAlign: 'top', color: '#0f172a' }}>
        {children}
      </td>
    </tr>
  );
}

function SectionRow({ label }) {
  return (
    <tr>
      <td colSpan={2} style={{ background: BRAND, color: '#fff', fontSize: 10, fontWeight: 700, letterSpacing: '0.6px', textTransform: 'uppercase', padding: '5px 12px' }}>
        {label}
      </td>
    </tr>
  );
}

function DescRow({ content }) {
  return (
    <tr style={{ borderBottom: '1px solid #f0f2f5' }}>
      <td colSpan={2} style={{ padding: '9px 12px', fontSize: 12, color: '#475569', lineHeight: 1.6 }}
        dangerouslySetInnerHTML={{ __html: content || '—' }}
      />
    </tr>
  );
}

const DEPT_LABELS = { 1: 'ITPD Helpdesk', 2: 'BIFA Helpdesk' };

export default function ItpdCard({ ticket }) {
  const label = DEPT_LABELS[ticket.itpd_status] || 'ITPD Helpdesk';

  const header = (
    <div className="px-[14px] py-[9px] text-[10px] font-bold uppercase tracking-[0.7px] text-white bg-brand border-b border-[#e8ecf1]">
      {label}
    </div>
  );

  // If embedded HTML exists (same as IT tickets), render it directly
  if (ticket.details) {
    return (
      <div className="bg-white border border-[#e8ecf1] rounded-[10px] overflow-hidden">
        {header}
        <div
          className="text-[12px] leading-relaxed overflow-x-auto"
          dangerouslySetInnerHTML={{ __html: decodeHtmlEntities(ticket.details) }}
        />
      </div>
    );
  }

  const hd = ticket.helpdesk;
  if (!hd) {
    return (
      <div className="bg-white border border-[#e8ecf1] rounded-[10px] overflow-hidden">
        {header}
        <div className="px-4 py-6 text-[13px] text-[#94a3b8]">No helpdesk record found.</div>
      </div>
    );
  }

  const priority = (hd.priority || 'P3').replace(/[\[\]]/g, '');

  return (
    <div className="bg-white border border-[#e8ecf1] rounded-[10px] overflow-hidden">
      {header}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <tbody>
          <FieldRow label="Priority"><PriorityBadge priority={priority} /></FieldRow>
          <FieldRow label="Application">{hd.application || '—'}</FieldRow>
          <FieldRow label="Incident Date">
            {hd.incident_date ? dayjs(hd.incident_date).format('MMMM D, YYYY hh:mm:ss A') : '—'}
          </FieldRow>
          <FieldRow label="Reported By">{hd.created_by || '—'}</FieldRow>
          <SectionRow label="Issue Description" />
          <DescRow content={hd.description} />
          <SectionRow label="Expected Behavior" />
          <DescRow content={hd.expected_behavior} />
          <SectionRow label="Steps to Replicate" />
          <DescRow content={hd.steps_to_replicate} />
        </tbody>
      </table>
    </div>
  );
}
