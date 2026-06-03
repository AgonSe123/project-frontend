import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { retailersApi } from '@/api/retailers';
import { scrapersApi } from '@/api/scrapers';
import { ApiClientError } from '@/api/client';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Table } from '@/components/ui/Table';

export function AdminScrapersPage() {
  const [retailers, setRetailers] = useState([]);
  const [scrapers, setScrapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(null);

  async function load() {
    setLoading(true);
    try {
      const [retailerList, scraperList] = await Promise.all([
        retailersApi.list(),
        scrapersApi.list(),
      ]);
      setRetailers(retailerList);
      setScrapers(scraperList);
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : 'Load failed');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function createScraper(retailerId) {
    setBusy(`create-${retailerId}`);
    try {
      await scrapersApi.save(retailerId, { status: 'IDLE' });
      await load();
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : 'Create failed');
    } finally {
      setBusy(null);
    }
  }

  async function triggerScrape(retailerId) {
    setBusy(`start-${retailerId}`);
    try {
      await scrapersApi.startJob(retailerId);
      await load();
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : 'Trigger failed');
    } finally {
      setBusy(null);
    }
  }

  const scraperByRetailer = new Map(scrapers.map((s) => [s.retailer_id, s]));

  return (
    <div>
      <h1 className="page-title">Scrapers</h1>
      <p className="page-subtitle">One scraper per retailer — trigger jobs and view logs.</p>
      {error && <div className="error-banner">{error}</div>}
      {loading ? (
        <LoadingSpinner />
      ) : retailers.length === 0 ? (
        <p className="text-muted">Add retailers first, then configure scrapers here.</p>
      ) : (
        <Table
          keyField="id"
          data={retailers}
          columns={[
            {
              key: 'name',
              header: 'Retailer',
              render: (r) => r.name,
            },
            {
              key: 'last_run',
              header: 'Last run',
              render: (r) => {
                const scraper = scraperByRetailer.get(r.id);
                return scraper?.last_run
                  ? new Date(scraper.last_run).toLocaleString()
                  : '—';
              },
            },
            {
              key: 'actions',
              header: 'Actions',
              render: (r) => {
                const scraper = scraperByRetailer.get(r.id);
                if (!scraper) {
                  return (
                    <Button
                      onClick={() => createScraper(r.id)}
                      loading={busy === `create-${r.id}`}
                    >
                      Create scraper
                    </Button>
                  );
                }
                return (
                  <div className="form-actions">
                    <Button
                      onClick={() => triggerScrape(r.id)}
                      loading={busy === `start-${r.id}`}
                    >
                      Trigger scrape
                    </Button>
                    <Link to={`/admin/scrapers/${r.id}/jobs`}>
                      <Button variant="secondary">View jobs</Button>
                    </Link>
                  </div>
                );
              },
            },
          ]}
        />
      )}
    </div>
  );
}
