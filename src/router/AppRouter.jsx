import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AppLayout from '../components/layout/AppLayout';
import IssuesPage from '../pages/Issues/IssuesPage';
import TicketDetailPage from '../pages/TicketDetail/TicketDetailPage';
import MergedTicketsPage from '../pages/MergedTickets/MergedTicketsPage';
import ReportsPage from '../pages/Reports/ReportsPage';
import LoginPage from '../pages/Auth/LoginPage';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
};

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="/tickets" replace />} />
          <Route path="tickets" element={<IssuesPage />} />
          <Route path="tickets/:ticketId" element={<TicketDetailPage />} />
          <Route path="merged" element={<MergedTicketsPage />} />
          <Route path="reports" element={<ReportsPage />} />
          {/* Unfinished pages (Device Replacement, Performance) removed from the demo */}
          <Route path="*" element={<Navigate to="/tickets" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
