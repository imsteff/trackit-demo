import { useState, useEffect } from 'react';
import ticketService from '../services/ticketService';

export const useTickets = (params = {}) => {
  const [tickets, setTickets] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const data = await ticketService.getTickets(params);
      setTickets(data.tickets || []);
      setTotal(data.total || 0);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTickets(); }, [JSON.stringify(params)]);

  return { tickets, total, loading, error, refetch: fetchTickets };
};

export const useTicket = (ticketId) => {
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTicket = async () => {
    if (!ticketId) return;
    try {
      setLoading(true);
      const data = await ticketService.getTicket(ticketId);
      setTicket(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTicket(); }, [ticketId]);

  return { ticket, loading, error, refetch: fetchTicket };
};

export const useMergedTickets = (params = {}) => {
  const [tickets, setTickets] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    try {
      setLoading(true);
      const data = await ticketService.getMerged(params);
      setTickets(data.tickets || []);
      setTotal(data.total || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, [JSON.stringify(params)]);

  return { tickets, total, loading, refetch: fetch };
};

export const useCounts = () => {
  const [counts, setCounts] = useState({ open: 0, in_progress: 0, cancelled: 0, resolved: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ticketService.getCounts()
      .then(setCounts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return { counts, loading };
};
