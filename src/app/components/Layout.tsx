import { Suspense } from 'react';
import { Outlet, ScrollRestoration } from 'react-router';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { CartPage } from './CartPage';
import { PageSkeleton } from './PageSkeleton';

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <ScrollRestoration />
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={<PageSkeleton />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
      <CartPage />
    </div>
  );
}