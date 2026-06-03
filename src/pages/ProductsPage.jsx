import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { productsApi } from '@/api/products';
import { ApiClientError } from '@/api/client';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { cn } from '@/lib/cn';

function SearchIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className="size-6 shrink-0 text-brand-dark"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
      />
    </svg>
  );
}

export function ProductsPage() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState(() => searchParams.get('search') ?? '');
  const [category, setCategory] = useState(() => searchParams.get('category') ?? '');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setSearch(searchParams.get('search') ?? '');
    setCategory(searchParams.get('category') ?? '');
  }, [searchParams]);

  useEffect(() => {
    setLoading(true);
    setError('');
    Promise.all([productsApi.list(), productsApi.getCategories()])
      .then(([productList, categoryList]) => {
        setProducts(productList);
        setCategories(categoryList);
      })
      .catch((err) =>
        setError(err instanceof ApiClientError ? err.message : 'Failed to load products'),
      )
      .finally(() => setLoading(false));
  }, []);

  const categoryOptions = useMemo(() => {
    if (categories.length > 0) return categories;
    return [...new Set(products.map((p) => p.category).filter(Boolean))].sort();
  }, [categories, products]);

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

  return (
    <div>
      <section className="page-hero page-hero-compact">
        <h1 className="text-3xl font-bold text-white md:text-4xl">
          {category || 'All categories'}
        </h1>
        <p className="mt-2 font-semibold text-brand-dark">
          Compare prices across retailers
        </p>
      </section>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-stretch sm:gap-4">
        <label
          className={cn(
            'flex min-h-14 flex-1 items-center gap-3 rounded-full border border-[#ced4da] bg-white px-5 py-2',
            'shadow-md ring-1 ring-[#dce8ef]',
            'focus-within:border-brand focus-within:ring-2 focus-within:ring-[#e7f1ff]',
          )}
        >
          <span className="sr-only">Search products</span>
          <SearchIcon />
          <input
            type="search"
            placeholder="Search by name, brand, or description…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent text-base text-brand-dark outline-none placeholder:text-[#717275] sm:text-lg"
          />
        </label>

        <label className="flex shrink-0 flex-col gap-1 sm:min-w-[220px]">
          <span className="sr-only">Category</span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={cn(
              'min-h-14 cursor-pointer rounded-full border border-[#ced4da] bg-white px-5 py-2.5',
              'text-base text-brand-dark shadow-md ring-1 ring-[#dce8ef] outline-none transition-colors sm:text-lg',
              'focus:border-brand focus:ring-2 focus:ring-[#e7f1ff]',
            )}
          >
            <option value="">All categories</option>
            {categoryOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      </div>

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
