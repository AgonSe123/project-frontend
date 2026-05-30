import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { scrapersApi } from '@/api/scrapers';
import { ApiClientError } from '@/api/client';
import { Card } from '@/components/ui/Card';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
export function DashboardPage() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    scrapersApi
      .getDashboardMetrics()
      .then(setMetrics)
      .catch((err) =>
        setError(err instanceof ApiClientError ? err.message : 'Failed to load metrics'),
      )
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="error-banner">{error}</div>;

  return (
    <div>
      <h1 className="page-title">Admin dashboard</h1>
      <p className="page-subtitle">Quick overview.</p>

      <div className="grid-3">
        <Card>
          <div className="metric-card">
            <span className="metric-value">{metrics?.totalProducts ?? 0}</span>
            <span className="metric-label">Products</span>
          </div>
          <Link to="/admin/products" className="mt-1">
            Manage products →
          </Link>
        </Card>
        <Card>
          <div className="metric-card">
            <span className="metric-value">{metrics?.totalRetailers ?? 0}</span>
            <span className="metric-label">Retailers</span>
          </div>
          <Link to="/admin/retailers" className="mt-1">
            Manage retailers →
          </Link>
        </Card>
        <Card>
          <div className="metric-card">
            <span className="metric-value">{metrics?.activeScrapers ?? 0}</span>
            <span className="metric-label">Active scrapers</span>
          </div>
          <Link to="/admin/scrapers" className="mt-1">
            Manage scrapers →
          </Link>
        </Card>
        <Card>
          <div className="metric-card">
            <span className="metric-value">{metrics?.failedScrapers ?? 0}</span>
            <span className="metric-label">Failed scrapers</span>
          </div>
        </Card>
        <Card>
          <div className="metric-card">
            <span className="metric-value">{metrics?.jobsToday ?? 0}</span>
            <span className="metric-label">Jobs today</span>
          </div>
        </Card>
        <Card>
          <div className="metric-card">
            <span className="metric-label">Last scrape</span>
            <span className="metric-value" style={{ fontSize: '1rem' }}>
              {metrics?.lastScrapeTime
                ? new Date(metrics.lastScrapeTime).toLocaleString()
                : '—'}
            </span>
          </div>
        </Card>
      </div>
    </div>
  );
}
