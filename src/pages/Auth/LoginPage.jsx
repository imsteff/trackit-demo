import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Demo: there is no login. The app is always in a logged-in state, so this
// route just sends visitors straight to the ticket queue.
export default function LoginPage() {
  const { user } = useAuth();
  useEffect(() => {}, []);
  return <Navigate to={user ? '/tickets' : '/tickets'} replace />;
}
