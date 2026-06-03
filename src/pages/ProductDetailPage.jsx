import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { productsApi } from '@/api/products';
import { retailersApi } from '@/api/retailers';
import { ApiClientError } from '@/api/client';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Table } from '@/components/ui/Table';

function formatPrice(cents) {
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'EUR',
  }).format(cents / 100);
}

function normalizeUrl(url) {
  if (!url) return null;
  if (/^https?:\/\//i.test(url)) return url;
  return `https://${url}`;
}

function PageHero({ title, subtitle, meta }) {
  return (
    <section className="page-hero page-hero-compact">
      <Link
        to="/products"
        className="mb-4 inline-block text-sm font-semibold text-white/90 no-underline hover:text-white"
      >
        ← Back to products
      </Link>
      <h1 className="text-3xl font-bold text-white md:text-4xl">{title}</h1>
      {subtitle && (
        <p className="mt-2 font-semibold text-brand-dark">{subtitle}</p>
      )}
      {meta && (
        <p className="mt-2 text-lg font-bold text-white">{meta}</p>
      )}
    </section>
  );
}

export function ProductDetailPage() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [retailers, setRetailers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!productId) return;
    setLoading(true);
    Promise.all([productsApi.getById(productId), retailersApi.list()])
      .then(([p, r]) => {
        setProduct(p);
        setRetailers(r);
      })
      .catch((err) =>
        setError(err instanceof ApiClientError ? err.message : 'Failed to load'),
      )
      .finally(() => setLoading(false));
  }, [productId]);

  const retailersById = useMemo(() => new Map(retailers.map((r) => [r.id, r])), [retailers]);

  function resolveRetailerName(row) {
    if (row.retailer?.name) return row.retailer.name;

    const retailerId = row.retailer_id ?? row.retailerId;
    if (retailerId) {
      return retailersById.get(retailerId)?.name ?? retailerId;
    }

    return 'Unknown retailer';
  }

  function resolveRetailerUrl(row) {
    if (row.retailer?.url) return row.retailer.url;

    const retailerId = row.retailer_id ?? row.retailerId;
    if (retailerId) {
      return retailersById.get(retailerId)?.url ?? null;
    }

    return null;
  }

  function handlePricingClick(row) {
    const url = normalizeUrl(resolveRetailerUrl(row));
    if (!url) return;
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  const prices = product?.product_prices ?? [];

  const lowestPriceId = useMemo(() => {
    if (!prices.length) return null;
    const available = prices.filter((p) => p.availability);
    if (!available.length) return null;
    return available.reduce((min, p) => (p.price < min.price ? p : min)).id;
  }, [prices]);

  const lowestPrice = useMemo(() => {
    if (!lowestPriceId) return null;
    return prices.find((p) => p.id === lowestPriceId)?.price ?? null;
  }, [prices, lowestPriceId]);

  if (loading) {
    return (
      <div>
        <PageHero title="Product" subtitle="Loading product details…" />
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <PageHero title="Product" subtitle="Something went wrong" />
        <div className="error-banner">{error}</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div>
        <PageHero title="Product not found" subtitle="This product may have been removed." />
        <p className="text-muted">Try browsing the catalog instead.</p>
      </div>
    );
  }

  const heroSubtitle = [product.brand, product.category].filter(Boolean).join(' · ');

  return (
    <div>
      <PageHero
        title={product.name}
        subtitle={heroSubtitle || undefined}
        meta={lowestPrice != null ? `From ${formatPrice(lowestPrice)}` : undefined}
      />

      <Card title="Product details" className="mb-8">
        <div className="mb-4 flex flex-wrap gap-2">
          {product.category && <Badge tone="info">{product.category}</Badge>}
          {product.brand && <Badge>{product.brand}</Badge>}
        </div>
        <dl className="grid gap-4 text-sm sm:grid-cols-2">
          <div>
            <dt className="font-semibold text-brand-dark">Brand</dt>
            <dd className="mt-1 text-muted">{product.brand || '—'}</dd>
          </div>
          <div>
            <dt className="font-semibold text-brand-dark">Category</dt>
            <dd className="mt-1 text-muted">{product.category || '—'}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="font-semibold text-brand-dark">Specifications</dt>
            <dd className="mt-1 text-muted">{product.specifications || '—'}</dd>
          </div>
        </dl>
        {product.description && (
          <p className="mt-4 leading-relaxed text-brand-dark">{product.description}</p>
        )}
      </Card>

      <h2 className="text-xl font-bold text-brand-dark">Retailer pricing</h2>
      <p className="page-subtitle">Click a row to visit the retailer&apos;s site.</p>

      <Table
        keyField="id"
        data={prices}
        emptyMessage="No retailer prices yet."
        onRowClick={handlePricingClick}
        isRowClickable={(row) => Boolean(normalizeUrl(resolveRetailerUrl(row)))}
        columns={[
          {
            key: 'retailer',
            header: 'Retailer',
            render: (row) => {
              const name = resolveRetailerName(row);
              const url = resolveRetailerUrl(row);
              if (!url) return name;
              return <span className="text-brand hover:text-brand-dark">{name}</span>;
            },
          },
          {
            key: 'price',
            header: 'Price',
            render: (row) => (
              <span className={row.id === lowestPriceId ? 'font-bold text-green-600' : ''}>
                {formatPrice(row.price)}
              </span>
            ),
          },
          {
            key: 'availability',
            header: 'Availability',
            render: (row) => (
              <Badge tone={row.availability ? 'success' : 'danger'}>
                {row.availability ? 'In stock' : 'Unavailable'}
              </Badge>
            ),
          },
          {
            key: 'updated',
            header: 'Last updated',
            render: (row) =>
              row.last_updated
                ? new Date(row.last_updated).toLocaleString()
                : '—',
          },
        ]}
      />
    </div>
  );
}
