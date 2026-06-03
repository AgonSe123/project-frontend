import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { productsApi } from '@/api/products';
import { retailersApi } from '@/api/retailers';
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

  const retailerNames = useMemo(() => {
    const map = new Map(retailers.map((r) => [r.id, r.name]));
    return map;
  }, [retailers]);

  const prices = product?.product_prices ?? [];

  const lowestPriceId = useMemo(() => {
    if (!prices.length) return null;
    const available = prices.filter((p) => p.availability);
    if (!available.length) return null;
    return available.reduce((min, p) => (p.price < min.price ? p : min)).id;
  }, [prices]);

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
          keyField="id"
          data={prices}
          emptyMessage="No retailer prices yet."
          columns={[
            {
              key: 'retailer',
              header: 'Retailer',
              render: (row) =>
                row.retailer?.name ??
                (row.retailer_id
                  ? retailerNames.get(row.retailer_id) ?? row.retailer_id
                  : 'Unknown retailer'),
            },
            {
              key: 'price',
              header: 'Price',
              render: (row) => (
                <span className={row.id === lowestPriceId ? 'lowest' : ''}>
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
    </div>
  );
}
