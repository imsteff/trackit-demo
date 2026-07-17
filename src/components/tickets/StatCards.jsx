import { useCounts } from '../../hooks/useTickets';

export default function StatCards() {
  const { counts } = useCounts();

  return (
    <div className="grid grid-cols-4 gap-3 mb-[18px]">
      <div className="bg-white border border-[#e8ecf1] rounded-[10px] p-[14px_16px]">
        <div className="flex items-center justify-between mb-[10px]">
          <div className="w-8 h-8 rounded-[8px] bg-[#eff6ff] text-brand flex items-center justify-center text-[16px]">
            <i className="ti ti-ticket" />
          </div>
          {counts.today > 0 && (
            <span className="text-[11px] font-semibold text-[#ef4444]">+{counts.today} today</span>
          )}
        </div>
        <div className="text-[26px] font-bold text-[#0f172a] tracking-[-1px] leading-none">{counts.open ?? 0}</div>
        <div className="text-[11px] text-[#94a3b8] font-semibold uppercase tracking-[0.5px] mt-1">Open Tickets</div>
      </div>

      <div className="bg-white border border-[#e8ecf1] rounded-[10px] p-[14px_16px]">
        <div className="flex items-center justify-between mb-[10px]">
          <div className="w-8 h-8 rounded-[8px] bg-[#eff6ff] text-blue-500 flex items-center justify-center text-[16px]">
            <i className="ti ti-loader" />
          </div>
          {counts.unassigned > 0 && (
            <span className="text-[11px] font-semibold text-[#ef4444]">{counts.unassigned} unassigned</span>
          )}
        </div>
        <div className="text-[26px] font-bold text-[#0f172a] tracking-[-1px] leading-none">{counts.in_progress ?? 0}</div>
        <div className="text-[11px] text-[#94a3b8] font-semibold uppercase tracking-[0.5px] mt-1">In Progress</div>
      </div>

      <div className="bg-white border border-[#e8ecf1] rounded-[10px] p-[14px_16px]">
        <div className="mb-[10px]">
          <div className="w-8 h-8 rounded-[8px] bg-[#fef2f2] text-red-500 flex items-center justify-center text-[16px]">
            <i className="ti ti-circle-x" />
          </div>
        </div>
        <div className="text-[26px] font-bold text-[#0f172a] tracking-[-1px] leading-none">{counts.cancelled ?? 0}</div>
        <div className="text-[11px] text-[#94a3b8] font-semibold uppercase tracking-[0.5px] mt-1">Cancelled</div>
      </div>

      <div className="bg-white border border-[#e8ecf1] rounded-[10px] p-[14px_16px]">
        <div className="mb-[10px]">
          <div className="w-8 h-8 rounded-[8px] bg-[#f0fdf4] text-green-500 flex items-center justify-center text-[16px]">
            <i className="ti ti-circle-check" />
          </div>
        </div>
        <div className="text-[26px] font-bold text-[#0f172a] tracking-[-1px] leading-none">{counts.resolved ?? 0}</div>
        <div className="text-[11px] text-[#94a3b8] font-semibold uppercase tracking-[0.5px] mt-1">Resolved</div>
      </div>
    </div>
  );
}
