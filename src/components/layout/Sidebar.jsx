import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { PERSONAS, getPersonaId, setPersona } from '../../mockData/demoAuth';

const NAV_MAIN = [
  { to: '/tickets', icon: 'ti-ticket', label: 'Ticketing' },
  { to: '/merged', icon: 'ti-git-merge', label: 'Merged Tickets' },
  { to: '/reports', icon: 'ti-chart-bar', label: 'Reports' },
];

function NavItem({ to, icon, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        'flex items-center gap-[9px] px-[10px] py-2 rounded-[7px] text-[13px] font-medium mb-[1px] transition-all duration-[120ms] no-underline ' +
        (isActive ? 'bg-[#eff6ff] text-brand' : 'text-[#64748b] hover:bg-[#f4f6f9] hover:text-[#1e293b]')
      }
    >
      <i className={`ti ${icon} text-[16px] w-[18px] text-center`} />
      {label}
    </NavLink>
  );
}

export default function Sidebar() {
  const { user } = useAuth();

  const name = user?.name || user?.uname || 'User';
  const initials = name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  const firstName = name.split(' ')[0];
  const role = user?.role || 'Staff';
  const personaId = getPersonaId();

  return (
    <aside className="w-[220px] min-w-[220px] bg-white border-r border-[#e8ecf1] flex flex-col">
      <div className="px-4 pt-[18px] pb-[14px] border-b border-[#f0f2f5]">
        <div className="flex items-center gap-[10px]">
          <div className="w-8 h-8 rounded-[8px] bg-brand text-white flex items-center justify-center text-[13px] font-bold shrink-0">
            TI
          </div>
          <div>
            <div className="text-[13px] font-bold text-[#0f172a]">TrackIT</div>
            <div className="text-[10px] text-[#94a3b8] uppercase tracking-[0.5px]">Technical Issue Reports</div>
          </div>
        </div>
      </div>

      <div className="px-[10px] pt-[14px] pb-[6px]">
        <div className="text-[10px] text-[#94a3b8] font-semibold uppercase tracking-[0.7px] px-2 mb-1">Main</div>
        {NAV_MAIN.map(item => <NavItem key={item.to} {...item} />)}
      </div>

      {/* Demo persona switcher — swaps department/role view without login */}
      <div className="px-[10px] pt-[14px] pb-[6px] mt-2">
        <div className="text-[10px] text-[#94a3b8] font-semibold uppercase tracking-[0.7px] px-2 mb-1">Demo View</div>
        <div className="flex flex-col gap-[3px]">
          {Object.values(PERSONAS).map(p => {
            const active = p.id === personaId;
            return (
              <button
                key={p.id}
                onClick={() => { if (!active) setPersona(p.id); }}
                className={
                  'text-left px-[10px] py-[6px] rounded-[7px] text-[12px] font-medium transition-all ' +
                  (active ? 'bg-[#eff6ff] text-brand' : 'text-[#64748b] hover:bg-[#f4f6f9] hover:text-[#1e293b]')
                }
              >
                <i className={`ti ti-user-check text-[13px] mr-[7px] ${active ? 'text-brand' : 'text-[#94a3b8]'}`} />
                {p.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-auto px-[10px] py-3 border-t border-[#f0f2f5]">
        <div className="flex items-center gap-[9px] px-[10px] py-2">
          <div className="w-7 h-7 rounded-full bg-[#eff6ff] flex items-center justify-center text-[10px] font-bold text-brand border-[1.5px] border-[#bfdbfe] shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[12px] font-semibold text-[#0f172a] truncate">{firstName}</div>
            <div className="text-[10px] text-[#94a3b8] truncate capitalize">{role}</div>
          </div>
        </div>
        <div className="text-[10px] text-[#94a3b8] text-center pt-1">Demo build with sample data.</div>
      </div>
    </aside>
  );
}
