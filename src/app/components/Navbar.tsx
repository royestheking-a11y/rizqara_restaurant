import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { ShoppingCart, Menu, X, Phone } from 'lucide-react';
import { useApp } from '../context/AppContext';

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Menu', path: '/menu' },
  { label: 'Gallery', path: '/gallery' },
  { label: 'Catering', path: '/catering' },
  { label: 'Reservation', path: '/reservation' },
  { label: 'Contact', path: '/contact' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { state, dispatch, cartCount } = useApp();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const isHome = location.pathname === '/';
  const isActive = (path: string) => location.pathname === path;

  const navBg = scrolled || !isHome
    ? 'bg-white shadow-lg'
    : 'bg-transparent';

  const textColor = scrolled || !isHome ? '#111111' : '#ffffff';
  const logoColor = scrolled || !isHome ? '#6B0F0F' : '#ffffff';

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBg}`}
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div>
                <div className="transition-colors duration-300" style={{ color: logoColor, fontWeight: 800, fontSize: '20px', letterSpacing: '1px' }}>
                  RIZQARA
                </div>
                <div style={{ color: '#D4AF37', fontSize: '10px', letterSpacing: '3px', fontWeight: 500, marginTop: '-2px' }}>
                  RESTAURANT
                </div>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 relative group"
                  style={{
                    color: isActive(link.path) ? '#6B0F0F' : textColor,
                    backgroundColor: isActive(link.path)
                      ? (scrolled || !isHome ? 'rgba(107,15,15,0.08)' : 'rgba(255,255,255,0.15)')
                      : 'transparent',
                  }}
                >
                  {link.label}
                  {!isActive(link.path) && (
                    <span
                      className="absolute bottom-1 left-4 right-4 h-0.5 scale-x-0 group-hover:scale-x-100 transition-transform duration-200 rounded-full"
                      style={{ backgroundColor: '#D4AF37' }}
                    />
                  )}
                </Link>
              ))}
            </div>

            {/* Right Side */}
            <div className="hidden lg:flex items-center gap-3">
              {/* Cart */}
              <button
                onClick={() => dispatch({ type: 'TOGGLE_CART' })}
                className="relative p-2.5 rounded-full transition-all duration-200 hover:scale-110"
                style={{
                  backgroundColor: scrolled || !isHome ? 'rgba(107,15,15,0.08)' : 'rgba(255,255,255,0.15)',
                  color: scrolled || !isHome ? '#6B0F0F' : 'white',
                }}
              >
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <span
                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold"
                    style={{ backgroundColor: '#D4AF37' }}
                  >
                    {cartCount}
                  </span>
                )}
              </button>

              <Link
                to="/reservation"
                className="px-5 py-2.5 rounded-full text-sm font-semibold text-white transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
                style={{ background: 'linear-gradient(135deg, #6B0F0F, #4A0A0A)' }}
              >
                Book Table
              </Link>
            </div>

            {/* Mobile Icons */}
            <div className="flex lg:hidden items-center gap-2">
              <button
                onClick={() => dispatch({ type: 'TOGGLE_CART' })}
                className="relative p-2 rounded-full"
                style={{ color: scrolled || !isHome ? '#6B0F0F' : 'white' }}
              >
                <ShoppingCart size={22} />
                {cartCount > 0 && (
                  <span
                    className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-white text-xs font-bold"
                    style={{ backgroundColor: '#D4AF37' }}
                  >
                    {cartCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => setMobileOpen(o => !o)}
                className="p-2 rounded-lg transition-colors"
                style={{ color: scrolled || !isHome ? '#6B0F0F' : 'white' }}
              >
                {mobileOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="lg:hidden bg-white shadow-xl border-t border-gray-100">
            <div className="px-4 py-4 space-y-1">
              {navLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-colors"
                  style={{
                    color: isActive(link.path) ? '#6B0F0F' : '#111111',
                    backgroundColor: isActive(link.path) ? 'rgba(107,15,15,0.08)' : 'transparent',
                  }}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-3 flex flex-col gap-2">
                <a
                  href="tel:+8801800000000"
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium"
                  style={{ borderColor: '#6B0F0F', color: '#6B0F0F' }}
                >
                  <Phone size={16} /> Call Now
                </a>
                <Link
                  to="/reservation"
                  className="flex items-center justify-center px-4 py-3 rounded-xl text-sm font-semibold text-white"
                  style={{ background: 'linear-gradient(135deg, #6B0F0F, #4A0A0A)' }}
                >
                  Book Table
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Notification Toast */}
      {state.notification && (
        <div
          className="fixed top-24 right-4 z-50 px-5 py-3 rounded-xl shadow-2xl text-white text-sm font-medium flex items-center gap-2 animate-slideInRight"
          style={{
            background: state.notification.type === 'success'
              ? 'linear-gradient(135deg, #6B0F0F, #4A0A0A)'
              : state.notification.type === 'error'
              ? '#DC2626'
              : '#1E40AF',
            minWidth: '260px',
          }}
        >
          <span className="text-base">
            {state.notification.type === 'success' ? '✓' : state.notification.type === 'error' ? '✕' : 'ℹ'}
          </span>
          {state.notification.message}
        </div>
      )}
    </>
  );
}