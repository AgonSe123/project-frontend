import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/cn';

const navLinkClass = ({ isActive }) =>
  cn(
    'text-sm font-semibold uppercase tracking-wide text-white transition-colors duration-200 hover:text-brand-dark',
    isActive && 'text-brand-dark',
  );

export function Header() {
  const { user, isAdmin, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-[#80d0c759] header-gradient shadow-sm">
      <div className="mx-auto flex h-[72px] max-w-6xl items-center gap-6 px-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xl font-bold text-white no-underline hover:text-white hover:opacity-90"
        >
          <img src="/techscout-logo-white.svg" alt="" className="h-8 w-8" />
          <span>TechScout</span>
        </Link>

        <nav className="flex flex-1 gap-6">
          {user && <NavLink to="/products" className={navLinkClass}>Products</NavLink>}
          {user && isAdmin && <NavLink to="/admin" className={navLinkClass}>Admin</NavLink>}
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="hidden max-w-[180px] truncate text-sm text-white/90 sm:inline">
                {user.email}
              </span>
              {user.is_verified === false && (
                <span className="rounded-full bg-white px-2.5 py-0.5 text-xs font-semibold text-brand-dark">
                  Email not verified
                </span>
              )}
              <Button variant="ghost" header onClick={() => logout()}>
                Log out
              </Button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-semibold text-white no-underline hover:text-brand-dark"
              >
                Log in
              </Link>
              <Link to="/register">
                <Button header>Sign up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
