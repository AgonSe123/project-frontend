import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { productsApi } from '@/api/products';
import { ApiClientError } from '@/api/client';
import { useAuth } from '@/context/AuthContext';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { FullBleed } from '@/components/home/FullBleed';

export function Categories() {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      setCategories([]);
      setLoading(false);
      setError('');
      return;
    }

    setLoading(true);
    setError('');
    productsApi
      .getCategories()
      .then(setCategories)
      .catch((err) => {
        setCategories([]);
        setError(err instanceof ApiClientError ? err.message : 'Failed to load categories');
      })
      .finally(() => setLoading(false));
  }, [user]);

  return (
    <FullBleed>
      <div id="categories" className="w-screen py-25">
        <div>
          <h2 className="mb-10 text-center text-3xl font-bold leading-tight md:text-4xl lg:text-5xl">
            Browse Categories
          </h2>
        </div>

        {!user ? (
          <p className="container mx-auto px-12 text-center text-lg text-muted">
            <Link to="/login" className="font-semibold text-brand hover:text-brand-dark">
              Log in
            </Link>{' '}
            to browse product categories.
          </p>
        ) : loading ? (
          <LoadingSpinner />
        ) : error ? (
          <p className="container mx-auto px-12 text-center text-lg text-red-600">{error}</p>
        ) : categories.length === 0 ? (
          <p className="container mx-auto max-w-2xl px-12 text-center text-lg leading-relaxed text-muted">
            No categories configured. Please notify an admin to add product categories.
          </p>
        ) : (
          <div className="container mx-auto flex justify-center">
            <div className="grid w-7/10 gap-4 gap-y-8 md:grid-cols-2 lg:grid-cols-3">
              {categories.map((category) => (
                <Link
                  key={category}
                  to={`/products?category=${encodeURIComponent(category)}`}
                  className="cursor-pointer rounded-2xl bg-neutral-50 p-8 text-center text-xl font-semibold shadow-lg transition-transform duration-300 hover:-translate-y-1 lg:text-2xl"
                >
                  {category}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </FullBleed>
  );
}
