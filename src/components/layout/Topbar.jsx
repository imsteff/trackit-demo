import { useLocation } from 'react-router-dom';
import DeptBadge from './DeptBadge';

const PAGE_META = {
  '/tickets':            { title: 'Issue Tickets',        sub: 'Open and in-progress technical reports' },
  '/merged':             { title: 'Merged Tickets',       sub: 'Tickets consolidated into one' },
  '/reports':            { title: 'Reports',              sub: 'Ticket analytics and exports' },
  '/device-replacement': { title: 'Device Replacement',   sub: 'Hardware replacement requests' },
  '/performance':        { title: 'Performance',          sub: 'Agent and resolution metrics' },
};

export default function Topbar({ actions, title, sub }) {
  const { pathname } = useLocation();
  const meta = (title != null)
    ? { title, sub: sub || '' }
    : (PAGE_META[pathname] || { title: 'TrackIT', sub: '' });

  return (
    <div className="bg-white border-b border-[#e8ecf1] px-6 py-[14px] flex items-center gap-4 shrink-0">
      <div>
        <div className="text-[16px] font-bold text-[#0f172a] tracking-[-0.2px]">{meta.title}</div>
        {meta.sub && <div className="text-[12px] text-[#94a3b8] mt-[1px]">{meta.sub}</div>}
      </div>
      <div className="ml-auto flex items-center gap-[10px]">
        {actions}
        <DeptBadge />
      </div>
    </div>
  );
}
