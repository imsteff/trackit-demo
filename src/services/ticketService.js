// Demo ticket service. No backend — reads/mutates local mock data so the UI
// renders and every action works visually within a session.
import {
  ITPD_TICKETS, IT_TICKETS, MERGED_TICKETS, REPORTS_TICKETS,
  TICKET_BY_NO, CATEGORIES, USERS, COUNTS, NOTES, delay,
} from '../mockData/tickets';
import { getDemoUser } from '../mockData/demoAuth';
import { getPlainSubject } from '../utils/htmlUtils';

const paginate = (rows, page = 1, limit = 10) => {
  const p = Number(page) || 1;
  const l = Number(limit) || 10;
  const start = (p - 1) * l;
  return { tickets: rows.slice(start, start + l), total: rows.length };
};

const subjectText = (t) => getPlainSubject(t.helpdesk?.subject || t.subject || '');

const matchesSearch = (t, q) => {
  if (!q) return true;
  const s = q.toLowerCase();
  return (
    (t.ticket_no || '').toLowerCase().includes(s) ||
    subjectText(t).toLowerCase().includes(s) ||
    (t.assigned_to || '').toLowerCase().includes(s) ||
    (t.outlet_name || '').toLowerCase().includes(s)
  );
};

const activeForDept = () => {
  const isIT = getDemoUser().itpd_status === 0;
  return isIT ? IT_TICKETS : ITPD_TICKETS;
};

const nameForValue = (value) => {
  if (!value) return null;
  const u = USERS.find((x) => x.value === value);
  if (u) return u.label;
  const deptLabels = {
    'it-department': 'IT Team',
    'it-projects-development': 'IT Projects Dev',
    'operations---fraud-amp-risk': 'Fraud & Risk',
  };
  return deptLabels[value] || value;
};

let noteSeq = 1000;

const ticketService = {
  async getTickets(params = {}) {
    let rows = activeForDept().filter((t) => matchesSearch(t, params.search));
    if (params.status === 'p1') {
      rows = rows.filter((t) => (t.helpdesk?.priority || '').includes('P1'));
    } else if (params.status) {
      rows = rows.filter((t) => String(t.ticket_status) === String(params.status));
    }
    return delay(paginate(rows, params.page, params.limit));
  },

  async getCounts() {
    return delay({ ...COUNTS });
  },

  async getMerged(params = {}) {
    const rows = MERGED_TICKETS.filter((t) => matchesSearch(t, params.search));
    return delay(paginate(rows, params.page, params.limit));
  },

  async getTicket(ticketId) {
    const t = TICKET_BY_NO[ticketId];
    return delay(t ? { ...t, chats: t.chats || [] } : null);
  },

  async updateStatus(ticketId, status) {
    const t = TICKET_BY_NO[ticketId];
    if (t) t.ticket_status = Number(status);
    return delay({ success: true });
  },

  async assignTicket(ticketId, value) {
    const t = TICKET_BY_NO[ticketId];
    if (t) t.assigned_to = nameForValue(value);
    return delay({ success: true });
  },

  async updatePriority(ticketId, priority) {
    const t = TICKET_BY_NO[ticketId];
    if (t) { t.helpdesk = t.helpdesk || {}; t.helpdesk.priority = `[${priority}]`; }
    return delay({ success: true });
  },

  async getUsers() {
    return delay(USERS.map((u) => ({ ...u })));
  },

  async mergeTicket(ticketId, parentId) {
    const t = TICKET_BY_NO[ticketId];
    if (t) { t.merged_to = parentId; t.ticket_status = 7; }
    return delay({ success: true });
  },

  async updateRemarks(ticketId, remarks) {
    const t = TICKET_BY_NO[ticketId];
    if (t) t.remarks = remarks;
    return delay({ success: true });
  },

  async addJiraLink(ticketId, jiraUrl) {
    const t = TICKET_BY_NO[ticketId];
    if (t) {
      const existing = (t.jira_ticket || '').trim();
      t.jira_ticket = existing ? `${existing}, ${jiraUrl}` : jiraUrl;
      t.jira_by = getDemoUser().name;
      t.jira_at = new Date().toISOString();
    }
    return delay({ success: true });
  },

  async removeJiraLink(ticketId, link) {
    const t = TICKET_BY_NO[ticketId];
    if (t) {
      t.jira_ticket = (t.jira_ticket || '')
        .split(',').map((l) => l.trim()).filter((l) => l && l !== link).join(', ');
    }
    return delay({ success: true });
  },

  async getNotes(ticketId) {
    return delay((NOTES[ticketId] || []).map((n) => ({ ...n })));
  },

  async addNote(ticketId, body) {
    const note = { note_id: noteSeq++, note_body: body, created_by: getDemoUser().name, created_at: new Date().toISOString() };
    NOTES[ticketId] = [...(NOTES[ticketId] || []), note];
    return delay(note);
  },

  async updateNote(ticketId, noteId, body) {
    NOTES[ticketId] = (NOTES[ticketId] || []).map((n) =>
      n.note_id === noteId ? { ...n, note_body: body } : n
    );
    return delay({ success: true });
  },

  async getCategories() {
    return delay(CATEGORIES.map((c) => ({ ...c })));
  },

  async updateCategory(ticketId, catId) {
    const t = TICKET_BY_NO[ticketId];
    if (t) t.cat_id = catId;
    return delay({ success: true });
  },
};

// Kept for parity with the report export (full unpaginated set).
export const ALL_REPORTS = REPORTS_TICKETS;

export default ticketService;
