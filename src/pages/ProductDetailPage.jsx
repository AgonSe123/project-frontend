import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { productsApi } from '@/api/products';
import { retailersApi } from '@/api/retailers';
import { ApiClientError } from '@/api/client';
import { Badge } from '@/components/ui/Badge';
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

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="error-banner">{error}</div>;
  if (!product) return <p className="text-muted">Product not found.</p>;

  return (
    <div>
      <Link to="/products" className="text-sm text-muted hover:text-brand-dark">
        ← Back to products
      </Link>
      <h1 className="page-title mt-4">{product.name}</h1>
      <div className="mb-6 grid gap-2 text-sm text-muted">
        <span><strong className="text-brand-dark">Brand:</strong> {product.brand}</span>
        <span><strong className="text-brand-dark">Category:</strong> {product.category}</span>
        <span><strong className="text-brand-dark">Specs:</strong> {product.specifications || '—'}</span>
      </div>
      <p className="mb-6 text-brand-dark">{product.description}</p>

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
