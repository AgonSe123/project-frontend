import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { productsApi } from '@/api/products';
import { ApiClientError } from '@/api/client';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import './products.css';

export function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function load(filters) {
    setLoading(true);
    setError('');
    try {
      const data = await productsApi.list(filters);
      setProducts(data);
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : 'Failed to load products');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function handleSearch(e) {
    e.preventDefault();
    load({ search: search || undefined, category: category || undefined });
  }

  return (
    <div>
      <h1 className="page-title">Products</h1>
      <p className="page-subtitle">
        Each product can have multiple retailer pricings — open a product to compare.
      </p>

      <form className="search-bar" onSubmit={handleSearch}>
        <Input
          label="Search"
          placeholder="Name, brand…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Input
          label="Category"
          placeholder="e.g. Electronics"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <Button type="submit">Search</Button>
      </form>

      {error && <div className="error-banner">{error}</div>}
      {loading ? (
        <LoadingSpinner />
      ) : products.length === 0 ? (
        <p className="text-muted">No products found.</p>
      ) : (
        <div className="product-grid">
          {products.map((p) => (
            <Card key={p.productId}>
              <div className="product-card-head">
                <h3>{p.name}</h3>
                <Badge tone="info">{p.category}</Badge>
              </div>
              <p className="text-muted">{p.brand}</p>
              <p className="product-desc">{p.description}</p>
              <Link to={`/products/${p.productId}`}>
                <Button variant="secondary">View prices</Button>
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
