import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';

export function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden">
      <Header />
      <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-6 md:px-6">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
