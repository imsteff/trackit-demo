# TrackIT — Demo

A frontend-only demo of a technical-issue ticketing dashboard for IT / support
teams, built with **React 18 + Vite + Tailwind CSS + shadcn/ui**.

> Portfolio demo. **No backend** — all data comes from local mock files under
> `src/mockData/`, and every action updates in-memory state only. Nothing is
> sent anywhere.

## Features

- **Ticketing** — department-aware ticket queue with stat cards, search/status
  filters, sortable + resizable columns, and inline priority/assignee/status
  actions (admin).
- **Ticket Detail** — helpdesk/outlet info card, chat thread, internal notes,
  merge + JIRA links, and an email-reply panel.
- **Merged Tickets** — tickets consolidated into a parent, with a quick-view modal.
- **Reports** — filterable table of closed tickets with client-side CSV export.
- **Demo persona switcher** — swap between **IT · Admin**, **ITPD · Admin**, and
  **ITPD · Staff (read-only)** from the sidebar to preview each department/role
  view without any login.

## Getting started

```bash
npm install
npm run dev
```

The app opens straight into a logged-in demo session — no authentication.

## Build

```bash
npm run build
npm run preview
```

## Notes

- Sample data (tickets, helpdesk records, chats, categories, technicians) lives
  in `src/mockData/`.
- `src/services/*` return that mock data with the same shapes a real API would,
  so the UI renders and behaves normally.
- All names, emails (`*@example.com`), ticket numbers, and IDs are fictional.
