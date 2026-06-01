import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { scrapersApi } from '@/api/scrapers';
import { ApiClientError } from '@/api/client';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Table } from '@/components/ui/Table';
function statusTone(status) {
  switch (status) {
    case 'RUNNING':
      return 'warning';
    case 'FAILED':
      return 'danger';
    case 'IDLE':
      return 'success';
    default:
      return 'default';
  }
}

export function AdminScrapersPage() {
  const [scrapers, setScrapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [triggering, setTriggering] = useState(null);

  async function load() {
    setLoading(true);
    try {
      setScrapers(await scrapersApi.list());
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : 'Load failed');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function triggerScrape(scraperId) {
    setTriggering(scraperId);
    try {
      await scrapersApi.trigger(scraperId);
      await load();
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : 'Trigger failed');
    } finally {
      setTriggering(null);
    }
  }

  return (
    <div>
      <h1 className="page-title">Scrapers</h1>
      <p className="page-subtitle">Trigger scrapes and check jobs.</p>
      {error && <div className="error-banner">{error}</div>}
      {loading ? (
        <LoadingSpinner />
      ) : (
        <Table
          keyField="scraperId"
          data={scrapers}
          columns={[
            {
              key: 'retailer',
              header: 'Retailer',
              render: (r) => r.retailer?.name ?? `Retailer #${r.retailerId}`,
            },
            {
              key: 'status',
              header: 'Status',
              render: (r) => <Badge tone={statusTone(r.status)}>{r.status}</Badge>,
            },
            {
              key: 'lastRun',
              header: 'Last run',
              render: (r) =>
                r.lastRun ? new Date(r.lastRun).toLocaleString() : 'Never',
            },
            {
              key: 'actions',
              header: 'Actions',
              render: (r) => (
                <div className="form-actions">
                  <Button
                    onClick={() => triggerScrape(r.scraperId)}
                    loading={triggering === r.scraperId}
                  >
                    Trigger scrape
                  </Button>
                  <Link to={`/admin/scrapers/${r.scraperId}/jobs`}>
                    <Button variant="secondary">View jobs</Button>
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
