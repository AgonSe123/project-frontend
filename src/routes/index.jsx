import { Routes, Route } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { AdminLayout } from '@/components/layout/Sidebar';
import { ProtectedRoute } from './ProtectedRoute';
import { HomePage } from '@/pages/HomePage';
import { ProductsPage } from '@/pages/ProductsPage';
import { ProductDetailPage } from '@/pages/ProductDetailPage';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { DashboardPage } from '@/pages/admin/DashboardPage';
import { AdminProductsPage } from '@/pages/admin/AdminProductsPage';
import { AdminRetailersPage } from '@/pages/admin/AdminRetailersPage';
import { AdminScrapersPage } from '@/pages/admin/AdminScrapersPage';
import { ScraperJobsPage } from '@/pages/admin/ScraperJobsPage';
import { ScraperLogsPage } from '@/pages/admin/ScraperLogsPage';
import { NotFoundPage } from '@/pages/NotFoundPage';

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="products" element={<ProductsPage />} />
          <Route path="products/:productId" element={<ProductDetailPage />} />
        </Route>

        <Route element={<ProtectedRoute adminOnly />}>
          <Route path="admin" element={<AdminLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="products" element={<AdminProductsPage />} />
            <Route path="retailers" element={<AdminRetailersPage />} />
            <Route path="scrapers" element={<AdminScrapersPage />} />
            <Route path="scrapers/:retailerId/jobs" element={<ScraperJobsPage />} />
            <Route
              path="scrapers/:retailerId/jobs/:jobId/logs"
              element={<ScraperLogsPage />}
            />
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
