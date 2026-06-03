import { Link } from 'react-router-dom';
import { HomeHero } from '@/components/home/HomeHero';
import { InformationSection } from '@/components/home/InformationSection';
import { FAQs } from '@/components/home/FAQs';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export function HomePage() {
  return (
    <div>
      <HomeHero />

      <div className="grid-3">
        <Card hover title="Products">
          <p className="text-muted">
            Browse the catalog and compare prices from multiple retailers for each product.
          </p>
          <Link to="/products" className="mt-4 inline-block">
            <Button>Browse products</Button>
          </Link>
        </Card>
        <Card hover title="Account">
          <p className="text-muted">
            Log in or create an account to browse products and compare prices.
          </p>
          <Link to="/login" className="mt-4 inline-block">
            <Button variant="secondary">Log in</Button>
          </Link>
        </Card>
        <Card hover title="Admin">
          <p className="text-muted">
            Admins manage products, retailers, scrapers, jobs, and scrape logs.
          </p>
          <Link to="/admin" className="mt-4 inline-block">
            <Button variant="secondary">Open dashboard</Button>
          </Link>
        </Card>
      </div>

      <InformationSection />
      <FAQs />
    </div>
  );
}
