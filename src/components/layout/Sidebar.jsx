import { NavLink, Outlet } from 'react-router-dom';
import { cn } from '@/lib/cn';

const adminLinks = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/products', label: 'Products' },
  { to: '/admin/retailers', label: 'Retailers' },
  { to: '/admin/scrapers', label: 'Scrapers' },
];

const sidebarLinkClass = ({ isActive }) =>
  cn(
    'mb-1 block rounded-xl px-3 py-2.5 text-sm font-semibold text-muted transition-colors duration-200 hover:bg-brand-light hover:text-brand-dark',
    isActive && 'bg-brand text-white hover:bg-brand hover:text-white',
  );

export function Sidebar() {
  return (
    <aside className="w-60 shrink-0 border-r border-[#dce8ef] bg-white px-3 py-5">
      <p className="mb-3 px-2 text-xs font-bold uppercase tracking-wider text-brand">
        Admin
      </p>
      <nav>
        {adminLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={sidebarLinkClass}
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
    <div className="flex min-h-[calc(100vh-72px)]">
      <Sidebar />
      <div className="max-w-4xl flex-1 p-6">
        <Outlet />
      </div>
    </div>
  );
}
