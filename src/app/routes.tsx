import { lazy } from 'react';
import { createBrowserRouter, Outlet } from 'react-router';
import { AppProvider } from './context/AppContext';
import { Layout } from './components/Layout';

// Lazy load all pages for maximum performance
const Home = lazy(() => import('./pages/Home').then(m => ({ default: m.Home })));
const About = lazy(() => import('./pages/About').then(m => ({ default: m.About })));
const Menu = lazy(() => import('./pages/Menu').then(m => ({ default: m.Menu })));
const ProductDetail = lazy(() => import('./pages/ProductDetail').then(m => ({ default: m.ProductDetail })));
const Gallery = lazy(() => import('./pages/Gallery').then(m => ({ default: m.Gallery })));
const Catering = lazy(() => import('./pages/Catering').then(m => ({ default: m.Catering })));
const Reservation = lazy(() => import('./pages/Reservation').then(m => ({ default: m.Reservation })));
const Contact = lazy(() => import('./pages/Contact').then(m => ({ default: m.Contact })));
const Checkout = lazy(() => import('./pages/Checkout').then(m => ({ default: m.Checkout })));
const OrderTracking = lazy(() => import('./pages/OrderTracking').then(m => ({ default: m.OrderTracking })));
const Admin = lazy(() => import('./pages/Admin').then(m => ({ default: m.Admin })));
const TableOrder = lazy(() => import('./pages/TableOrder').then(m => ({ default: m.TableOrder })));
const KitchenDisplay = lazy(() => import('./pages/KitchenDisplay').then(m => ({ default: m.KitchenDisplay })));
const NotFound = lazy(() => import('./pages/NotFound').then(m => ({ default: m.NotFound })));




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
