import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { scrapersApi } from '@/api/scrapers';
import { ApiClientError } from '@/api/client';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Table } from '@/components/ui/Table';
function logTone(level) {
  switch (level) {
    case 'ERROR':
      return 'danger';
    case 'WARN':
      return 'warning';
    case 'INFO':
      return 'info';
    default:
      return 'default';
  }
}

export function ScraperLogsPage() {
  const { jobId } = useParams();
  const id = Number(jobId);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id || Number.isNaN(id)) return;
    scrapersApi
      .getJobLogs(id)
      .then(setLogs)
      .catch((err) =>
        setError(err instanceof ApiClientError ? err.message : 'Failed to load logs'),
      )
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div>
      <Link to="/admin/scrapers">← Scrapers</Link>
      <h1 className="page-title mt-1">Scrape logs</h1>
      <p className="page-subtitle">Job #{id}</p>
      {error && <div className="error-banner">{error}</div>}
      {loading ? (
        <LoadingSpinner />
      ) : (
        <Table
          keyField="logId"
          data={logs}
          columns={[
            {
              key: 'time',
              header: 'Timestamp',
              render: (r) => new Date(r.timestamp).toLocaleString(),
            },
            {
              key: 'level',
              header: 'Level',
              render: (r) => <Badge tone={logTone(r.logLevel)}>{r.logLevel}</Badge>,
            },
            { key: 'message', header: 'Message', render: (r) => r.message },
          ]}
        />
      )}
    </div>
  );
}
