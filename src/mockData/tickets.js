// Fake ticket data for the demo. Shapes match exactly what the pages/components
// consume. Ticket numbers use a neutral "TKT-" scheme; all names/emails fake.

// Small artificial latency so loading states are briefly visible.
export const delay = (value, ms = 250) =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms));

export const CATEGORIES = [
  { cat_id: 1, cat_name: 'Hardware' },
  { cat_id: 2, cat_name: 'Network' },
  { cat_id: 3, cat_name: 'POS / Terminal' },
  { cat_id: 4, cat_name: 'Account / Access' },
  { cat_id: 5, cat_name: 'Application Bug' },
  { cat_id: 6, cat_name: 'Printer' },
];

// Technicians for the assignee dropdowns: { value: slug, label: name }
export const USERS = [
  { value: 'jrivera', label: 'Jordan Rivera' },
  { value: 'mlee', label: 'Morgan Lee' },
  { value: 'pnair', label: 'Priya Nair' },
  { value: 'dsantos', label: 'Diego Santos' },
  { value: 'akhan', label: 'Aisha Khan' },
];

const itSubject = (text) =>
  `<table><tbody><tr><th>${text}</th></tr></tbody></table>`;

const detailsBlock = (rows) =>
  `<table style="width:100%;border-collapse:collapse;font-size:12px">` +
  rows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:7px 12px;background:#f8fafc;color:#475569;font-weight:500;width:38%">${k}</td>` +
        `<td style="padding:7px 12px;color:#0f172a">${v}</td></tr>`
    )
    .join('') +
  `</tbody></table>`;

const chat = (id, by, at, body) => ({ chat_id: id, created_by: by, created_at: at, chat_body: body });

// ---- ITPD / BIFA tickets (itpd_status 1) — helpdesk-backed ----
export const ITPD_TICKETS = [
  {
    ticket_id: 1, ticket_no: 'TKT-100231', itpd_status: 1, ticket_status: 1,
    assigned_to: null, cat_id: 5, created_at: '2026-07-14 09:12:00', modified_at: '2026-07-14 09:12:00', modified_by: null,
    jira_ticket: '', merged_to: null,
    helpdesk: {
      subject: itSubject('Settlement report fails to generate'),
      priority: '[P1]', application: 'Back Office Portal',
      incident_date: '2026-07-14 08:50:00', created_by: 'Ella Cruz',
      description: 'Generating the daily settlement report throws a 500 error after selecting the date range.',
      expected_behavior: 'The report should download as a PDF for the selected range.',
      steps_to_replicate: '1. Open Reports. 2. Pick yesterday. 3. Click Generate.',
    },
    chats: [
      chat(11, 'Ella Cruz', '2026-07-14 09:15:00', 'This is blocking end-of-day. Can someone look ASAP?'),
      chat(12, 'Jordan Rivera', '2026-07-14 09:40:00', 'Looking into it now — reproduced on staging. Will update shortly.'),
    ],
  },
  {
    ticket_id: 2, ticket_no: 'TKT-100232', itpd_status: 1, ticket_status: 3,
    assigned_to: 'Jordan Rivera', cat_id: 4, created_at: '2026-07-13 14:05:00', modified_at: '2026-07-14 08:20:00', modified_by: 'Jordan Rivera',
    jira_ticket: 'https://example.atlassian.net/browse/DEMO-142', jira_by: 'Jordan Rivera', jira_at: '2026-07-14 08:20:00', merged_to: null,
    helpdesk: {
      subject: itSubject('User cannot reset password from portal'),
      priority: '[P2]', application: 'Identity Portal',
      incident_date: '2026-07-13 13:40:00', created_by: 'Marco Reyes',
      description: 'Password reset email never arrives for a subset of users.',
      expected_behavior: 'Reset email should be delivered within a minute.',
      steps_to_replicate: 'Request reset for affected account; inbox/spam empty.',
    },
    chats: [
      chat(21, 'Marco Reyes', '2026-07-13 14:10:00', 'Three users reported this today.'),
      chat(22, 'Jordan Rivera', '2026-07-13 15:00:00', 'Found a bounce in the mail logs — investigating the provider config.'),
    ],
  },
  {
    ticket_id: 3, ticket_no: 'TKT-100233', itpd_status: 1, ticket_status: 4,
    assigned_to: 'Priya Nair', cat_id: 5, created_at: '2026-07-12 11:30:00', modified_at: '2026-07-13 09:00:00', modified_by: 'Priya Nair',
    jira_ticket: '', merged_to: null,
    helpdesk: {
      subject: itSubject('Dashboard totals off by one day'),
      priority: '[P3]', application: 'Analytics Dashboard',
      incident_date: '2026-07-12 11:00:00', created_by: 'Nadia Gomez',
      description: 'The daily totals appear shifted by a day in the timezone conversion.',
      expected_behavior: 'Totals should match the local business day.',
      steps_to_replicate: 'Compare dashboard total vs raw export for any day.',
    },
    chats: [chat(31, 'Nadia Gomez', '2026-07-12 11:35:00', 'Not urgent but confusing for the ops team.')],
  },
  {
    ticket_id: 4, ticket_no: 'TKT-100234', itpd_status: 1, ticket_status: 1,
    assigned_to: null, cat_id: 2, created_at: '2026-07-14 10:45:00', modified_at: '2026-07-14 10:45:00', modified_by: null,
    jira_ticket: '', merged_to: null,
    helpdesk: {
      subject: itSubject('API latency spikes during peak hours'),
      priority: '[P2]', application: 'Public API',
      incident_date: '2026-07-14 10:20:00', created_by: 'Sam Okafor',
      description: 'Response times exceed 3s between 6–8pm.',
      expected_behavior: 'p95 latency under 500ms.',
      steps_to_replicate: 'Load test the /orders endpoint at peak.',
    },
    chats: [],
  },
  {
    ticket_id: 5, ticket_no: 'TKT-100235', itpd_status: 1, ticket_status: 3,
    assigned_to: 'Diego Santos', cat_id: 5, created_at: '2026-07-11 16:00:00', modified_at: '2026-07-14 07:10:00', modified_by: 'Diego Santos',
    jira_ticket: '', merged_to: null,
    helpdesk: {
      subject: itSubject('Export button unresponsive on Safari'),
      priority: '[P3]', application: 'Reports Module',
      incident_date: '2026-07-11 15:30:00', created_by: 'Lucia Ferrari',
      description: 'CSV export does nothing on Safari; works on Chrome.',
      expected_behavior: 'Export should download on all major browsers.',
      steps_to_replicate: 'Open Reports in Safari, click Export.',
    },
    chats: [chat(51, 'Lucia Ferrari', '2026-07-11 16:05:00', 'Happens on iPad too.')],
  },
  {
    ticket_id: 6, ticket_no: 'TKT-100236', itpd_status: 2, ticket_status: 1,
    assigned_to: null, cat_id: 4, created_at: '2026-07-14 08:05:00', modified_at: '2026-07-14 08:05:00', modified_by: null,
    jira_ticket: '', merged_to: null,
    helpdesk: {
      subject: itSubject('Suspicious login attempts flagged'),
      priority: '[P1]', application: 'Fraud Console',
      incident_date: '2026-07-14 07:45:00', created_by: 'Grace Lim',
      description: 'Multiple failed logins from an unusual location on one account.',
      expected_behavior: 'Account auto-locks and alerts the risk team.',
      steps_to_replicate: 'Review the flagged session in the Fraud Console.',
    },
    chats: [chat(61, 'Grace Lim', '2026-07-14 08:10:00', 'Escalating to the risk team for review.')],
  },
  {
    ticket_id: 7, ticket_no: 'TKT-100237', itpd_status: 1, ticket_status: 3,
    assigned_to: 'Aisha Khan', cat_id: 1, created_at: '2026-07-10 09:00:00', modified_at: '2026-07-13 12:00:00', modified_by: 'Aisha Khan',
    jira_ticket: '', merged_to: null,
    helpdesk: {
      subject: itSubject('Scheduled job stopped running'),
      priority: '[P2]', application: 'Batch Scheduler',
      incident_date: '2026-07-10 08:30:00', created_by: 'Tom Becker',
      description: 'The nightly reconciliation job has not run for two days.',
      expected_behavior: 'Job runs at 02:00 daily and logs completion.',
      steps_to_replicate: 'Check scheduler history for the recon job.',
    },
    chats: [],
  },
];

// ---- IT dept tickets (itpd_status 0) — outlet-backed, HTML details ----
export const IT_TICKETS = [
  {
    ticket_id: 20, ticket_no: 'TKT-200114', itpd_status: 0, ticket_status: 1,
    assigned_to: null, cat_id: 3, outlet_name: 'Downtown Branch', outlet_code: 'DTB-01',
    subject: 'POS terminal not printing receipts',
    created_at: '2026-07-14 09:30:00', modified_at: '2026-07-14 09:30:00', modified_by: null,
    details: detailsBlock([
      ['Outlet', 'Downtown Branch (DTB-01)'],
      ['Reported By', 'Cashier — Reyna Ortiz'],
      ['Issue', 'Terminal 2 accepts payment but does not print a receipt.'],
      ['Impact', 'Customers leaving without receipts during rush hours.'],
    ]),
    chats: [chat(201, 'Reyna Ortiz', '2026-07-14 09:35:00', 'Paper is loaded fine, still nothing prints.')],
  },
  {
    ticket_id: 21, ticket_no: 'TKT-200115', itpd_status: 0, ticket_status: 8,
    assigned_to: 'Morgan Lee', cat_id: 2, outlet_name: 'Harbor Outlet', outlet_code: 'HBR-04',
    subject: 'Intermittent network drops',
    created_at: '2026-07-13 10:10:00', modified_at: '2026-07-14 08:00:00', modified_by: 'Morgan Lee',
    details: detailsBlock([
      ['Outlet', 'Harbor Outlet (HBR-04)'],
      ['Reported By', 'Manager — Kofi Mensah'],
      ['Issue', 'Wi-Fi drops every ~20 minutes across the floor.'],
      ['Impact', 'Card terminals disconnect mid-transaction.'],
    ]),
    chats: [chat(211, 'Morgan Lee', '2026-07-13 11:00:00', 'Dispatching a replacement access point today.')],
  },
  {
    ticket_id: 22, ticket_no: 'TKT-200116', itpd_status: 0, ticket_status: 3,
    assigned_to: 'Diego Santos', cat_id: 1, outlet_name: 'Uptown Store', outlet_code: 'UPT-09',
    subject: 'Back-office PC will not boot',
    created_at: '2026-07-12 08:20:00', modified_at: '2026-07-13 15:30:00', modified_by: 'Diego Santos',
    details: detailsBlock([
      ['Outlet', 'Uptown Store (UPT-09)'],
      ['Reported By', 'Supervisor — Hana Suzuki'],
      ['Issue', 'PC powers on but stops at the manufacturer logo.'],
      ['Impact', 'Cannot run end-of-day reports locally.'],
    ]),
    chats: [],
  },
  {
    ticket_id: 23, ticket_no: 'TKT-200117', itpd_status: 0, ticket_status: 1,
    assigned_to: null, cat_id: 6, outlet_name: 'Airport Kiosk', outlet_code: 'APK-02',
    subject: 'Label printer prints blank labels',
    created_at: '2026-07-14 07:50:00', modified_at: '2026-07-14 07:50:00', modified_by: null,
    details: detailsBlock([
      ['Outlet', 'Airport Kiosk (APK-02)'],
      ['Reported By', 'Staff — Omar Haddad'],
      ['Issue', 'Labels feed through blank after a firmware update.'],
      ['Impact', 'Manual price tags being used as a workaround.'],
    ]),
    chats: [chat(231, 'Omar Haddad', '2026-07-14 07:55:00', 'Started right after the update last night.')],
  },
  {
    ticket_id: 24, ticket_no: 'TKT-200118', itpd_status: 0, ticket_status: 3,
    assigned_to: 'Aisha Khan', cat_id: 4, outlet_name: 'Lakeside Branch', outlet_code: 'LKS-06',
    subject: 'New hire cannot log into POS',
    created_at: '2026-07-11 13:15:00', modified_at: '2026-07-12 10:00:00', modified_by: 'Aisha Khan',
    details: detailsBlock([
      ['Outlet', 'Lakeside Branch (LKS-06)'],
      ['Reported By', 'Manager — Bea Santos'],
      ['Issue', 'New cashier account exists but is denied at the terminal.'],
      ['Impact', 'New hire cannot start shifts.'],
    ]),
    chats: [],
  },
];

// ---- Merged tickets (status 7) ----
export const MERGED_TICKETS = [
  { ticket_id: 40, ticket_no: 'TKT-100238', itpd_status: 1, ticket_status: 7, assigned_to: 'Jordan Rivera', created_at: '2026-07-09 09:00:00', modified_at: '2026-07-10 09:00:00', merged_to: 'TKT-100232', cat_id: 4, subject: 'Duplicate: password reset email issue', details: detailsBlock([['Note', 'Merged into TKT-100232 — same root cause.']]), chats: [] },
  { ticket_id: 41, ticket_no: 'TKT-100239', itpd_status: 1, ticket_status: 7, assigned_to: 'Priya Nair', created_at: '2026-07-08 10:30:00', modified_at: '2026-07-09 11:00:00', merged_to: 'TKT-100233', cat_id: 5, subject: 'Duplicate: dashboard off by one day', details: detailsBlock([['Note', 'Merged into TKT-100233.']]), chats: [] },
  { ticket_id: 42, ticket_no: 'TKT-200119', itpd_status: 0, ticket_status: 7, assigned_to: 'Morgan Lee', created_at: '2026-07-07 08:00:00', modified_at: '2026-07-08 09:00:00', merged_to: 'TKT-200115', cat_id: 2, outlet_name: 'Harbor Outlet', outlet_code: 'HBR-04', subject: 'Duplicate: network drops', details: detailsBlock([['Note', 'Merged into TKT-200115.']]), chats: [] },
  { ticket_id: 43, ticket_no: 'TKT-100240', itpd_status: 1, ticket_status: 7, assigned_to: 'Diego Santos', created_at: '2026-07-06 14:00:00', modified_at: '2026-07-07 09:00:00', merged_to: 'TKT-100235', cat_id: 5, subject: 'Duplicate: Safari export bug', details: detailsBlock([['Note', 'Merged into TKT-100235.']]), chats: [] },
  { ticket_id: 44, ticket_no: 'TKT-100241', itpd_status: 1, ticket_status: 7, assigned_to: 'Jordan Rivera', created_at: '2026-07-05 09:30:00', modified_at: '2026-07-06 10:00:00', merged_to: 'TKT-100231', cat_id: 5, subject: 'Duplicate: settlement report error', details: detailsBlock([['Note', 'Merged into TKT-100231.']]), chats: [] },
];

// ---- Reports: closed tickets (status 5=Cancelled, 6=Resolved, 10=Escalated) ----
export const REPORTS_TICKETS = [
  { ticket_id: 60, ticket_no: 'TKT-100210', itpd_status: 1, ticket_status: 6, cat_id: 5, outlet_name: '—', subject: 'Login loop after update', helpdesk: { subject: itSubject('Login loop after update'), priority: '[P1]' }, created_at: '2026-06-20 09:00:00', modified_at: '2026-06-21 14:00:00', modified_by: 'Jordan Rivera', resolved_by: 'Jordan Rivera', resolved_date: '2026-06-21 14:00:00', root_cause: 'Stale session cookie after deploy.', resolution: 'Cleared cache and shipped a cookie-version bump.', remarks: 'Confirmed with reporter.' },
  { ticket_id: 61, ticket_no: 'TKT-100211', itpd_status: 1, ticket_status: 6, cat_id: 2, outlet_name: '—', subject: 'Slow API responses', helpdesk: { subject: itSubject('Slow API responses'), priority: '[P2]' }, created_at: '2026-06-22 10:15:00', modified_at: '2026-06-23 09:30:00', modified_by: 'Priya Nair', resolved_by: 'Priya Nair', resolved_date: '2026-06-23 09:30:00', root_cause: 'Missing DB index on orders.', resolution: 'Added composite index; p95 back under 400ms.', remarks: '' },
  { ticket_id: 62, ticket_no: 'TKT-200090', itpd_status: 0, ticket_status: 6, cat_id: 3, outlet_name: 'Downtown Branch', subject: 'Terminal freezing', created_at: '2026-06-24 11:00:00', modified_at: '2026-06-24 16:00:00', modified_by: 'Morgan Lee', resolved_by: 'Morgan Lee', resolved_date: '2026-06-24 16:00:00', root_cause: 'Faulty card reader firmware.', resolution: 'Reflashed firmware on-site.', remarks: 'Monitored for 24h.' },
  { ticket_id: 63, ticket_no: 'TKT-100212', itpd_status: 1, ticket_status: 5, cat_id: 5, outlet_name: '—', subject: 'Feature request logged as bug', helpdesk: { subject: itSubject('Feature request logged as bug'), priority: '[P3]' }, created_at: '2026-06-25 13:00:00', modified_at: '2026-06-25 15:00:00', modified_by: 'Diego Santos', resolved_by: '', resolved_date: null, root_cause: 'Not a defect.', resolution: 'Redirected to product backlog.', remarks: 'Cancelled.' },
  { ticket_id: 64, ticket_no: 'TKT-200091', itpd_status: 0, ticket_status: 6, cat_id: 1, outlet_name: 'Uptown Store', subject: 'Monitor flickering', created_at: '2026-06-26 09:45:00', modified_at: '2026-06-26 12:00:00', modified_by: 'Aisha Khan', resolved_by: 'Aisha Khan', resolved_date: '2026-06-26 12:00:00', root_cause: 'Loose display cable.', resolution: 'Reseated cable; replaced spare.', remarks: '' },
  { ticket_id: 65, ticket_no: 'TKT-100213', itpd_status: 1, ticket_status: 10, cat_id: 4, outlet_name: '—', subject: 'Data mismatch in export', helpdesk: { subject: itSubject('Data mismatch in export'), priority: '[P1]' }, created_at: '2026-06-27 08:00:00', modified_at: '2026-06-28 10:00:00', modified_by: 'Jordan Rivera', resolved_by: '', resolved_date: null, root_cause: 'Under investigation by data team.', resolution: '', remarks: 'Escalated to data engineering.' },
  { ticket_id: 66, ticket_no: 'TKT-100214', itpd_status: 1, ticket_status: 6, cat_id: 5, outlet_name: '—', subject: 'Email notifications delayed', helpdesk: { subject: itSubject('Email notifications delayed'), priority: '[P2]' }, created_at: '2026-06-29 14:20:00', modified_at: '2026-06-30 09:00:00', modified_by: 'Priya Nair', resolved_by: 'Priya Nair', resolved_date: '2026-06-30 09:00:00', root_cause: 'Queue worker under-provisioned.', resolution: 'Scaled workers; added alerting.', remarks: '' },
  { ticket_id: 67, ticket_no: 'TKT-200092', itpd_status: 0, ticket_status: 6, cat_id: 6, outlet_name: 'Airport Kiosk', subject: 'Receipt printer jam', created_at: '2026-07-01 10:00:00', modified_at: '2026-07-01 11:30:00', modified_by: 'Morgan Lee', resolved_by: 'Morgan Lee', resolved_date: '2026-07-01 11:30:00', root_cause: 'Debris in the feed path.', resolution: 'Cleaned rollers; tested 50 prints.', remarks: '' },
  { ticket_id: 68, ticket_no: 'TKT-100215', itpd_status: 1, ticket_status: 6, cat_id: 5, outlet_name: '—', subject: 'Broken link on help page', helpdesk: { subject: itSubject('Broken link on help page'), priority: '[P3]' }, created_at: '2026-07-02 09:00:00', modified_at: '2026-07-02 10:00:00', modified_by: 'Diego Santos', resolved_by: 'Diego Santos', resolved_date: '2026-07-02 10:00:00', root_cause: 'Outdated URL.', resolution: 'Updated the link.', remarks: '' },
  { ticket_id: 69, ticket_no: 'TKT-200093', itpd_status: 0, ticket_status: 5, cat_id: 2, outlet_name: 'Lakeside Branch', subject: 'Requested Wi-Fi upgrade', created_at: '2026-07-03 13:00:00', modified_at: '2026-07-03 14:00:00', modified_by: 'Aisha Khan', resolved_by: '', resolved_date: null, root_cause: 'Not an incident.', resolution: 'Routed to procurement.', remarks: 'Cancelled.' },
];

// Combined lookup for the ticket-detail view (by ticket_no).
const ALL = [...ITPD_TICKETS, ...IT_TICKETS, ...MERGED_TICKETS, ...REPORTS_TICKETS];
export const TICKET_BY_NO = ALL.reduce((m, t) => { m[t.ticket_no] = t; return m; }, {});

export const COUNTS = {
  open: ITPD_TICKETS.filter(t => [1, 2, 8].includes(t.ticket_status)).length +
        IT_TICKETS.filter(t => [1, 2, 8].includes(t.ticket_status)).length,
  in_progress: ITPD_TICKETS.filter(t => t.ticket_status === 3).length +
               IT_TICKETS.filter(t => t.ticket_status === 3).length,
  cancelled: REPORTS_TICKETS.filter(t => t.ticket_status === 5).length,
  resolved: REPORTS_TICKETS.filter(t => t.ticket_status === 6).length,
  today: 3,
  unassigned: ITPD_TICKETS.filter(t => !t.assigned_to).length +
              IT_TICKETS.filter(t => !t.assigned_to).length,
};

// In-memory notes store keyed by ticket_no.
export const NOTES = {
  'TKT-100232': [
    { note_id: 1, note_body: 'Checked mail provider logs — bounce due to SPF misconfig.', created_by: 'Jordan Rivera', created_at: '2026-07-13 15:10:00' },
  ],
  'TKT-100231': [
    { note_id: 2, note_body: 'Reproduced on staging with the July 14 date range.', created_by: 'Jordan Rivera', created_at: '2026-07-14 09:45:00' },
  ],
};
