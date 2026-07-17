import { useState } from 'react';
import { useTickets } from '../../hooks/useTickets';
import { useAuth } from '../../context/AuthContext';
import StatCards from '../../components/tickets/StatCards';
import FilterBar from '../../components/tickets/FilterBar';
import TicketTable from '../../components/tickets/TicketTable';
import Topbar from '../../components/layout/Topbar';
import ScrollArea from '../../components/common/ScrollArea';

export default function IssuesPage() {
  const { user } = useAuth();
  const isIT = user?.itpd_status === 0;

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState('');
  const [sortDir, setSortDir] = useState('desc');

  const params = { search, status: statusFilter, page, limit, sortBy, sortDir };
  const { tickets, total, loading, refetch } = useTickets(params);

  const handleSearch     = (val) => { setSearch(val); setPage(1); };
  const handleStatus     = (val) => { setStatusFilter(val); setPage(1); };
  const handleSort       = (col, dir) => { setSortBy(col); setSortDir(dir); setPage(1); };
  const handleLimitChange = (n) => { setLimit(n); setPage(1); };

  return (
    <>
      <Topbar />
      <ScrollArea className="flex-1 p-[20px_24px]">
        <StatCards />
        <FilterBar
          search={search}
          onSearch={handleSearch}
          statusFilter={statusFilter}
          onStatusFilter={handleStatus}
        />
        <TicketTable
          tickets={tickets}
          total={total}
          page={page}
          limit={limit}
          onPageChange={setPage}
          onLimitChange={handleLimitChange}
          loading={loading}
          onUpdated={refetch}
          isIT={isIT}
          sortBy={sortBy}
          sortDir={sortDir}
          onSort={handleSort}
        />
      </ScrollArea>
    </>
  );
}
