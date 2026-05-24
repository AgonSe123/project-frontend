import { NavLink, Outlet } from 'react-router-dom';
import './Sidebar.css';

const adminLinks = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/products', label: 'Products' },
  { to: '/admin/retailers', label: 'Retailers' },
  { to: '/admin/scrapers', label: 'Scrapers' },
];

export function Sidebar() {
  return (
    <aside className="admin-sidebar">
      <p className="sidebar-label">Admin</p>
      <nav>
        {adminLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) =>
              isActive ? 'sidebar-link active' : 'sidebar-link'
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export function AdminLayout() {
  return (
    <div className="admin-shell">
      <Sidebar />
      <div className="admin-content">
        <Outlet />
      </div>
    </div>
  );
}
