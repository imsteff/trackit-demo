// Demo auth service. No backend, no SSO — returns the local demo user.
import { getDemoUser } from '../mockData/demoAuth';

const validate = async () => {
  const user = getDemoUser();
  return { user, access_token: user.access_token };
};

const me = async () => getDemoUser();

export default { validate, me };
