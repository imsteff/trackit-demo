import { useState, useEffect } from 'react';
import reportService from '../services/reportService';

export const useReports = (params = {}) => {
  const [tickets, setTickets] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    try {
      setLoading(true);
      const data = await reportService.getReports(params);
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
