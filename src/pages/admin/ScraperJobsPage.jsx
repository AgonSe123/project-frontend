import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { scrapersApi } from '@/api/scrapers';
import { ApiClientError } from '@/api/client';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Table } from '@/components/ui/Table';
function jobTone(status) {
  switch (status) {
    case 'COMPLETED':
      return 'success';
    case 'RUNNING':
      return 'warning';
    case 'FAILED':
      return 'danger';
    default:
      return 'default';
  }
}

export function ScraperJobsPage() {
  const { scraperId } = useParams();
  const id = Number(scraperId);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id || Number.isNaN(id)) return;
    scrapersApi
      .getJobs(id)
      .then(setJobs)
      .catch((err) =>
        setError(err instanceof ApiClientError ? err.message : 'Failed to load jobs'),
      )
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div>
      <Link to="/admin/scrapers">← Back to scrapers</Link>
      <h1 className="page-title mt-1">Scrape jobs</h1>
      <p className="page-subtitle">Scraper #{id} — view logs for each job.</p>
      {error && <div className="error-banner">{error}</div>}
      {loading ? (
        <LoadingSpinner />
      ) : (
        <Table
          keyField="jobId"
          data={jobs}
          columns={[
            { key: 'id', header: 'Job ID', render: (r) => r.jobId },
            {
              key: 'status',
              header: 'Status',
              render: (r) => <Badge tone={jobTone(r.status)}>{r.status}</Badge>,
            },
            {
              key: 'start',
              header: 'Started',
              render: (r) => new Date(r.startTime).toLocaleString(),
            },
            {
              key: 'end',
              header: 'Ended',
              render: (r) =>
                r.endTime ? new Date(r.endTime).toLocaleString() : '—',
            },
            {
              key: 'logs',
              header: 'Logs',
              render: (r) => (
                <Link to={`/admin/jobs/${r.jobId}/logs`}>
                  <Button variant="secondary">View logs</Button>
                </Link>
              ),
            },
          ]}
        />
      )}
    </div>
  );
}
