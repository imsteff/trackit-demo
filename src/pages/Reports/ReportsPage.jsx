import { useState } from 'react';
import { useReports } from '../../hooks/useReports';
import reportService from '../../services/reportService';
import Topbar from '../../components/layout/Topbar';
import ScrollArea from '../../components/common/ScrollArea';
import ReportFilters from '../../components/reports/ReportFilters';
import ReportTable from '../../components/reports/ReportTable';
import { getPlainSubject } from '../../utils/htmlUtils';
import { formatDateTime } from '../../utils/formatDate';
import { resolutionTime } from '../../utils/formatDuration';
import { downloadCsv } from '../../utils/exportCsv';

const EXPORT_COLUMNS = [
  { label: 'Ticket', value: (t) => t.ticket_no },
  { label: 'Outlet', value: (t) => t.outlet_name },
  { label: 'Subject', value: (t) => getPlainSubject(t.helpdesk?.subject || t.subject) },
  { label: 'Priority', value: (t) => (t.helpdesk?.priority || '').replace(/[\[\]]/g, '') },
  { label: 'Status', value: (t) => t.ticket_status },
  { label: 'Date Reported', value: (t) => (t.created_at ? formatDateTime(t.created_at) : '') },
  { label: 'Last Update', value: (t) => (t.modified_at ? formatDateTime(t.modified_at) : '') },
  { label: 'Closed By', value: (t) => t.modified_by },
  { label: 'Resolved By', value: (t) => t.resolved_by },
  { label: 'Date Resolved', value: (t) => (t.resolved_date ? formatDateTime(t.resolved_date) : '') },
  { label: 'Resolution Time', value: (t) => resolutionTime(t.created_at, t.resolved_date || t.modified_at) },
  { label: 'Root Cause', value: (t) => t.root_cause },
  { label: 'Resolution', value: (t) => t.resolution },
  { label: 'Remarks', value: (t) => t.remarks },
];

const INITIAL_FILTERS = {
  search: '', ticket_status: '', ticket_category: '', ticket_resolution: '',
  technician: '', date_type: '', startdate: '', enddate: '',
};

export default function ReportsPage() {
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [page, setPage] = useState(1);
  const [exporting, setExporting] = useState(false);
  const limit = 25;

  const { tickets, total, loading } = useReports({ ...filters, page, limit });

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const handleExport = async () => {
    try {
      setExporting(true);
      const rows = await reportService.exportReports(filters);
      downloadCsv('trackit-reports.csv', EXPORT_COLUMNS, rows);
    } catch (err) {
      console.error(err);
    } finally {
      setExporting(false);
    }
  };

  return (
    <>
      <Topbar />
      <ScrollArea className="flex-1 p-[20px_24px]">
        <ReportFilters
          filters={filters}
          onChange={handleFilterChange}
          onExport={handleExport}
          exporting={exporting}
        />
        <ReportTable
          tickets={tickets}
          total={total}
          page={page}
          limit={limit}
          loading={loading}
          onPageChange={setPage}
        />
      </ScrollArea>
    </>
  );
}
