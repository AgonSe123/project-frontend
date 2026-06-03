import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import './Header.css';

export function Header() {
  const { user, isAdmin, logout } = useAuth();

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link to="/" className="brand">
          TechScout
        </Link>
        <nav className="main-nav">
          {user && <NavLink to="/products">Products</NavLink>}
          {user && isAdmin && <NavLink to="/admin">Admin</NavLink>}
        </nav>
        <div className="header-actions">
          {user ? (
            <>
              <span className="user-email">{user.email}</span>
              {user.is_verified === false && (
                <span className="verify-hint">Email not verified</span>
              )}
              <Button variant="ghost" onClick={() => logout()}>
                Log out
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">Log in</Link>
              <Link to="/register">
                <Button>Sign up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
