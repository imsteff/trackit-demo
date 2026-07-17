import { useAuth } from '../../context/AuthContext';

const DEPT_LABELS = { 0: 'IT Team', 1: 'ITPD', 2: 'BIFA' };

export default function DeptBadge() {
  const { user } = useAuth();
  if (!user) return null;

  const label = DEPT_LABELS[user.itpd_status] || DEPT_LABELS[0];

  return (
    <span className="inline-flex items-center gap-[6px] px-[11px] py-[5px] rounded-full text-[12px] font-semibold bg-[#eff6ff] text-brand">
      <span className="w-[6px] h-[6px] rounded-full bg-brand" />
      {label}
    </span>
  );
}
