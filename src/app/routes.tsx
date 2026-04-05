import { createBrowserRouter, Outlet } from 'react-router';
import { AppProvider } from './context/AppContext';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Menu } from './pages/Menu';
import { ProductDetail } from './pages/ProductDetail';
import { Gallery } from './pages/Gallery';
import { Catering } from './pages/Catering';
import { Reservation } from './pages/Reservation';
import { Contact } from './pages/Contact';
import { Checkout } from './pages/Checkout';
import { OrderTracking } from './pages/OrderTracking';
import { Admin } from './pages/Admin';
import { TableOrder } from './pages/TableOrder';
import { KitchenDisplay } from './pages/KitchenDisplay';
import { NotFound } from './pages/NotFound';

function Root() {
  return (
    <AppProvider>
      <Outlet />
    </AppProvider>
  );
}

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    children: [
      {
        Component: Layout,
        children: [
          { index: true, Component: Home },
          { path: 'about', Component: About },
          { path: 'menu', Component: Menu },
          { path: 'menu/:slug', Component: ProductDetail },
          { path: 'gallery', Component: Gallery },
          { path: 'catering', Component: Catering },
          { path: 'reservation', Component: Reservation },
          { path: 'contact', Component: Contact },
          { path: 'checkout', Component: Checkout },
          { path: 'order-tracking', Component: OrderTracking },
          { path: '*', Component: NotFound },
        ],
      },
      {
        // Admin is completely standalone — no Navbar/Footer/CartSidebar
        path: 'admin',
        Component: Admin,
      },
      {
        // Guest QR table ordering — standalone, no Navbar/Footer
        path: 'table/:tableId',
        Component: TableOrder,
      },
      {
        // Kitchen display screen — standalone
        path: 'kitchen',
        Component: KitchenDisplay,
      },
    ],
  },
]);
