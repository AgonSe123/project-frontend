import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export function HomePage() {
  return (
    <div>
      <h1 className="page-title">Compare product prices across retailers</h1>
      <p className="page-subtitle">
        Search products, compare retailer pricing, and manage scrapers from the admin dashboard.
      </p>

      <div className="grid-3 mt-2">
        <Card title="Products">
          <p className="text-muted">
            Browse the catalog and compare prices from multiple retailers for each product.
          </p>
          <Link to="/products">
            <Button className="mt-1">Browse products</Button>
          </Link>
        </Card>
        <Card title="Account">
          <p className="text-muted">
            Log in or create an account to browse products and compare prices.
          </p>
          <Link to="/login">
            <Button variant="secondary" className="mt-1">
              Log in
            </Button>
          </Link>
        </Card>
        <Card title="Admin">
          <p className="text-muted">
            Admins manage products, retailers, scrapers, jobs, and scrape logs.
          </p>
          <Link to="/admin">
            <Button variant="secondary" className="mt-1">
              Open dashboard
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}
