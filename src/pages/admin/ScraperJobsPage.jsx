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
    case 'SUCCESSFUL':
      return 'success';
    case 'RUNNING':
      return 'warning';
    case 'FAILED':
    case 'INTERRUPTED':
      return 'danger';
    default:
      return 'default';
  }
}

export function ScraperJobsPage() {
  const { retailerId } = useParams();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(null);

  async function loadJobs() {
    if (!retailerId) return;
    const data = await scrapersApi.getJobs(retailerId);
    setJobs(data);
  }

  useEffect(() => {
    if (!retailerId) return;
    setLoading(true);
    loadJobs()
      .catch((err) =>
        setError(err instanceof ApiClientError ? err.message : 'Failed to load jobs'),
      )
      .finally(() => setLoading(false));
  }, [retailerId]);

  async function stopJob(jobId) {
    setBusy(`stop-${jobId}`);
    setError('');
    try {
      await scrapersApi.stopJob(retailerId, jobId);
      await loadJobs();
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : 'Failed to stop job');
    } finally {
      setBusy(null);
    }
  }

  return (
    <div>
      <Link to="/admin/scrapers">← Back to scrapers</Link>
      <h1 className="page-title mt-1">Scrape jobs</h1>
      <p className="page-subtitle">Retailer {retailerId}</p>
      {error && <div className="error-banner">{error}</div>}
      {loading ? (
        <LoadingSpinner />
      ) : (
        <Table
          keyField="id"
          data={jobs}
          columns={[
            { key: 'id', header: 'Job ID', render: (r) => r.id },
            {
              key: 'status',
              header: 'Status',
              render: (r) => <Badge tone={jobTone(r.status)}>{r.status}</Badge>,
            },
            {
              key: 'start',
              header: 'Started',
              render: (r) =>
                r.start_time ? new Date(r.start_time).toLocaleString() : '—',
            },
            {
              key: 'end',
              header: 'Ended',
              render: (r) =>
                r.end_time ? new Date(r.end_time).toLocaleString() : '—',
            },
            {
              key: 'actions',
              header: 'Actions',
              render: (r) => (
                <div className="form-actions">
                  {r.status === 'RUNNING' && (
                    <Button
                      variant="danger"
                      onClick={() => stopJob(r.id)}
                      loading={busy === `stop-${r.id}`}
                    >
                      Stop
                    </Button>
                  )}
                  <Link to={`/admin/scrapers/${retailerId}/jobs/${r.id}/logs`}>
                    <Button variant="secondary">View logs</Button>
                  </Link>
                </div>
              ),
            },
          ]}
        />
      )}
    </div>
  );
}
