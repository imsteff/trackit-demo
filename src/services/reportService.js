// Demo report service. No backend — filters the local closed-ticket set.
import { REPORTS_TICKETS, delay } from '../mockData/tickets';

const applyFilters = (params = {}) => {
  let rows = REPORTS_TICKETS.map((t) => ({ ...t }));

  if (params.search) {
    const s = params.search.toLowerCase();
    rows = rows.filter(
      (t) =>
        (t.ticket_no || '').toLowerCase().includes(s) ||
        (t.outlet_name || '').toLowerCase().includes(s)
    );
  }
  if (params.ticket_status) {
    rows = rows.filter((t) => String(t.ticket_status) === String(params.ticket_status));
  }
  if (params.ticket_category) {
    rows = rows.filter((t) => String(t.cat_id) === String(params.ticket_category));
  }
  return rows;
};

const reportService = {
  async getReports(params = {}) {
    const rows = applyFilters(params);
    const page = Number(params.page) || 1;
    const limit = Number(params.limit) || 25;
    const start = (page - 1) * limit;
    return delay({ tickets: rows.slice(start, start + limit), total: rows.length });
  },

  async exportReports(params = {}) {
    // Full, unpaginated set for CSV export.
    return delay(applyFilters(params), 150);
  },
};

export default reportService;
