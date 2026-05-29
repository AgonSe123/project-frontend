import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { productsApi } from '@/api/products';
import { ApiClientError } from '@/api/client';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Table } from '@/components/ui/Table';
import './products.css';

function formatPrice(cents) {
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'EUR',
  }).format(cents / 100);
}

export function ProductDetailPage() {
  const { productId } = useParams();
  const id = Number(productId);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id || Number.isNaN(id)) return;
    setLoading(true);
    productsApi
      .getById(id)
      .then(setProduct)
      .catch((err) =>
        setError(err instanceof ApiClientError ? err.message : 'Failed to load'),
      )
      .finally(() => setLoading(false));
  }, [id]);

  const lowestPriceId = useMemo(() => {
    if (!product?.prices?.length) return null;
    const available = product.prices.filter((p) => p.availabilityStatus);
    if (!available.length) return null;
    return available.reduce((min, p) =>
      p.price < min.price ? p : min,
    ).priceId;
  }, [product]);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="error-banner">{error}</div>;
  if (!product) return <p>Product not found.</p>;

  return (
    <div>
      <Link to="/products" className="text-muted">
        ← Back to products
      </Link>
      <h1 className="page-title mt-1">{product.name}</h1>
      <div className="product-meta">
        <span>
          <strong>Brand:</strong> {product.brand}
        </span>
        <span>
          <strong>Category:</strong> {product.category}
        </span>
        <span>
          <strong>Specs:</strong> {product.specifications || '—'}
        </span>
      </div>
      <p>{product.description}</p>

      <h2>Retailer pricing</h2>
      <p className="page-subtitle">Prices from each retailer.</p>

      <div className="price-table">
        <Table
          keyField="priceId"
          data={product.prices ?? []}
          emptyMessage="No retailer prices yet."
          columns={[
            {
              key: 'retailer',
              header: 'Retailer',
              render: (row) =>
                row.retailer?.name ?? `Retailer #${row.retailerId}`,
            },
            {
              key: 'price',
              header: 'Price',
              render: (row) => (
                <span className={row.priceId === lowestPriceId ? 'lowest' : ''}>
                  {formatPrice(row.price)}
                </span>
              ),
            },
            {
              key: 'availability',
              header: 'Availability',
              render: (row) => (
                <Badge tone={row.availabilityStatus ? 'success' : 'danger'}>
                  {row.availabilityStatus ? 'In stock' : 'Unavailable'}
                </Badge>
              ),
            },
            {
              key: 'updated',
              header: 'Last updated',
              render: (row) => new Date(row.lastUpdated).toLocaleString(),
            },
          ]}
        />
      </div>
    </div>
  );
}
