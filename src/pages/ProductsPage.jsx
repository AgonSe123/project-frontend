import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { productsApi } from '@/api/products';
import { ApiClientError } from '@/api/client';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export function ProductsPage() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState(() => searchParams.get('search') ?? '');
  const [category, setCategory] = useState(() => searchParams.get('category') ?? '');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const q = searchParams.get('search');
    const c = searchParams.get('category');
    if (q) setSearch(q);
    if (c) setCategory(c);
  }, [searchParams]);

  useEffect(() => {
    setLoading(true);
    setError('');
    productsApi
      .list()
      .then(setProducts)
      .catch((err) =>
        setError(err instanceof ApiClientError ? err.message : 'Failed to load products'),
      )
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const cat = category.trim().toLowerCase();
    return products.filter((p) => {
      const matchesSearch =
        !q ||
        [p.name, p.brand, p.description]
          .filter(Boolean)
          .some((v) => v.toLowerCase().includes(q));
      const matchesCategory =
        !cat || (p.category ?? '').toLowerCase() === cat;
      return matchesSearch && matchesCategory;
    });
  }, [products, search, category]);

  function handleSearch(e) {
    e.preventDefault();
  }

  return (
    <div>
      <section className="page-hero page-hero-compact">
        <h1 className="text-3xl font-bold text-white md:text-4xl">Products</h1>
        <p className="mt-2 font-semibold text-brand-dark">
          Compare prices across retailers
        </p>
      </section>

      <p className="page-subtitle">
        Each product can have multiple retailer pricings — open a product to compare.
      </p>

      <form
        className="mb-6 grid max-w-3xl grid-cols-1 items-end gap-4 rounded-full bg-white p-3 shadow-md md:grid-cols-[1fr_1fr_auto]"
        onSubmit={handleSearch}
      >
        <Input
          label="Search"
          hideLabel
          placeholder="Name, brand…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Input
          label="Category"
          hideLabel
          placeholder="e.g. Electronics"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <Button type="submit">Filter</Button>
      </form>

      {error && <div className="error-banner">{error}</div>}
      {loading ? (
        <LoadingSpinner />
      ) : filtered.length === 0 ? (
        <p className="text-muted">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <Card key={p.id} hover>
              <div className="mb-2 flex items-start justify-between gap-2">
                <h3 className="text-lg font-bold text-brand-dark">{p.name}</h3>
                <Badge tone="info">{p.category}</Badge>
              </div>
              <p className="text-muted">{p.brand}</p>
              <p className="mb-4 line-clamp-2 text-sm text-muted">{p.description}</p>
              <Link to={`/products/${p.id}`}>
                <Button variant="secondary">View prices</Button>
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
