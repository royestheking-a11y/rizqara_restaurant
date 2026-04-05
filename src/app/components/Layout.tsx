import { Outlet, ScrollRestoration } from 'react-router';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { CartPage } from './CartPage';

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <ScrollRestoration />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <CartPage />
    </div>
  );
}