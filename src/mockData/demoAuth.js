// Demo authentication / persona state (no backend, no SSO).
// The app opens directly into a logged-in demo session. A persona switcher
// (in the sidebar) lets each department/role view be demoed without login.

const PERSONA_KEY = 'demoPersona';

// itpd_status: 0 = IT dept, 1 = IT Projects Dev (ITPD), 2 = Fraud & Risk (BIFA)
// role: 'admin' unlocks inline edit controls; anything else is read-only.
export const PERSONAS = {
  'itpd-admin': {
    id: 'itpd-admin', label: 'ITPD · Admin',
    name: 'Jordan Rivera', uname: 'jrivera', emp_id: 'EMP-1001',
    email: 'jordan.rivera@example.com', dept_slug: 'it-projects-development',
    role: 'admin', itpd_status: 1,
  },
  'it-admin': {
    id: 'it-admin', label: 'IT · Admin',
    name: 'Morgan Lee', uname: 'mlee', emp_id: 'EMP-1007',
    email: 'morgan.lee@example.com', dept_slug: 'it-department',
    role: 'admin', itpd_status: 0,
  },
  'itpd-staff': {
    id: 'itpd-staff', label: 'ITPD · Staff (read-only)',
    name: 'Priya Nair', uname: 'pnair', emp_id: 'EMP-1042',
    email: 'priya.nair@example.com', dept_slug: 'it-projects-development',
    role: 'staff', itpd_status: 1,
  },
};

export const DEFAULT_PERSONA = 'itpd-admin';

export const getPersonaId = () => {
  const stored = typeof localStorage !== 'undefined' ? localStorage.getItem(PERSONA_KEY) : null;
  return stored && PERSONAS[stored] ? stored : DEFAULT_PERSONA;
};

export const setPersona = (id) => {
  if (!PERSONAS[id]) return;
  localStorage.setItem(PERSONA_KEY, id);
  // Reload so dept-gated data, columns, and controls re-evaluate cleanly.
  window.location.reload();
};

export const getDemoUser = () => {
  const p = PERSONAS[getPersonaId()];
  return { ...p, access_token: 'demo-token' };
};
