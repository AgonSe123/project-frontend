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
  const { retailerId, jobId } = useParams();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!retailerId || !jobId) return;
    scrapersApi
      .getJobLogs(retailerId, jobId)
      .then(setLogs)
      .catch((err) =>
        setError(err instanceof ApiClientError ? err.message : 'Failed to load logs'),
      )
      .finally(() => setLoading(false));
  }, [retailerId, jobId]);

  return (
    <div>
      <Link to={`/admin/scrapers/${retailerId}/jobs`}>← Jobs</Link>
      <h1 className="page-title mt-1">Scrape logs</h1>
      <p className="page-subtitle">Job {jobId}</p>
      {error && <div className="error-banner">{error}</div>}
      {loading ? (
        <LoadingSpinner />
      ) : (
        <Table
          keyField="id"
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
              render: (r) => <Badge tone={logTone(r.log_level)}>{r.log_level}</Badge>,
            },
            { key: 'message', header: 'Message', render: (r) => r.message },
          ]}
        />
      )}
    </div>
  );
}
