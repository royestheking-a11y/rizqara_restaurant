import { Link } from 'react-router';
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Twitter, Youtube, ChevronRight } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{ backgroundColor: '#111111', fontFamily: 'var(--font-body)' }}>
      {/* Top Strip */}
      <div className="border-b" style={{ borderColor: 'rgba(212,175,55,0.2)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div>
                <h2 style={{ color: '#ffffff', fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '22px', letterSpacing: '2px' }}>
                  RIZQARA
                </h2>
                <p style={{ color: '#D4AF37', fontSize: '11px', letterSpacing: '4px', fontWeight: 500 }}>
                  RESTAURANT
                </p>
              </div>
            </div>
            <p style={{ color: '#9CA3AF', fontSize: '14px', maxWidth: '400px', textAlign: 'center', lineHeight: '1.6' }}>
              Premium dining experience in Dhaka. Bringing you the finest flavors from around the world, crafted with love and expertise.
            </p>
            <Link
              to="/reservation"
              className="flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm whitespace-nowrap transition-all hover:shadow-lg hover:-translate-y-0.5"
              style={{ background: 'linear-gradient(135deg, #D4AF37, #B8960C)', color: '#111', fontFamily: 'var(--font-heading)' }}
            >
              Reserve a Table
              <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* About */}
          <div>
            <h3 style={{ color: '#D4AF37', fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '16px', letterSpacing: '1px', marginBottom: '16px' }}>
              About Rizqara
            </h3>
            <p style={{ color: '#9CA3AF', fontSize: '14px', lineHeight: '1.8' }}>
              Rizqara Restaurant is a premium dining destination in Dhaka, offering a wide variety of delicious meals prepared with fresh ingredients and expert care since 2018.
            </p>
            <div className="flex gap-3 mt-5">
              {[
                { icon: Facebook, href: '#', color: '#1877F2' },
                { icon: Instagram, href: '#', color: '#E1306C' },
                { icon: Twitter, href: '#', color: '#1DA1F2' },
                { icon: Youtube, href: '#', color: '#FF0000' },
              ].map(({ icon: Icon, href, color }, i) => (
                <a
                  key={i}
                  href={href}
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110"
                  style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                >
                  <Icon size={16} style={{ color }} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 style={{ color: '#D4AF37', fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '16px', letterSpacing: '1px', marginBottom: '16px' }}>
              Quick Links
            </h3>
            <ul className="space-y-3">
              {[
                { label: 'Home', path: '/' },
                { label: 'About Us', path: '/about' },
                { label: 'Our Menu', path: '/menu' },
                { label: 'Gallery', path: '/gallery' },
                { label: 'Catering', path: '/catering' },
                { label: 'Reservation', path: '/reservation' },
                { label: 'Contact', path: '/contact' },
              ].map(({ label, path }) => (
                <li key={path}>
                  <Link
                    to={path}
                    className="flex items-center gap-2 transition-colors group"
                    style={{ color: '#9CA3AF', fontSize: '14px' }}
                  >
                    <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" style={{ color: '#D4AF37' }} />
                    <span className="group-hover:text-white transition-colors">{label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Menu Categories */}
          <div>
            <h3 style={{ color: '#D4AF37', fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '16px', letterSpacing: '1px', marginBottom: '16px' }}>
              Menu Categories
            </h3>
            <ul className="space-y-3">
              {['Biryani', 'Kebab', 'Chinese', 'Thai', 'Indian', 'Drinks', 'Dessert'].map(cat => (
                <li key={cat}>
                  <Link
                    to={`/menu?category=${cat}`}
                    className="flex items-center gap-2 group"
                    style={{ color: '#9CA3AF', fontSize: '14px' }}
                  >
                    <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" style={{ color: '#D4AF37' }} />
                    <span className="group-hover:text-white transition-colors">{cat}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 style={{ color: '#D4AF37', fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '16px', letterSpacing: '1px', marginBottom: '16px' }}>
              Contact Info
            </h3>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: 'rgba(107,15,15,0.3)' }}>
                  <MapPin size={14} style={{ color: '#D4AF37' }} />
                </div>
                <span style={{ color: '#9CA3AF', fontSize: '14px', lineHeight: '1.6' }}>
                  M9W9+R6, Natun Bazar, Dhaka, Bangladesh
                </span>
              </li>
              <li className="flex gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(107,15,15,0.3)' }}>
                  <Phone size={14} style={{ color: '#D4AF37' }} />
                </div>
                <div>
                  <a href="tel:+8801800000000" style={{ color: '#9CA3AF', fontSize: '14px', display: 'block' }} className="hover:text-white transition-colors">
                    +880 1800-000000
                  </a>
                  <a href="tel:+8801900000000" style={{ color: '#9CA3AF', fontSize: '14px', display: 'block' }} className="hover:text-white transition-colors">
                    +880 1900-000000
                  </a>
                </div>
              </li>
              <li className="flex gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(107,15,15,0.3)' }}>
                  <Mail size={14} style={{ color: '#D4AF37' }} />
                </div>
                <a href="mailto:info@rizqara.com" style={{ color: '#9CA3AF', fontSize: '14px' }} className="hover:text-white transition-colors">
                  info@rizqara.com
                </a>
              </li>
              <li className="flex gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(107,15,15,0.3)' }}>
                  <Clock size={14} style={{ color: '#D4AF37' }} />
                </div>
                <div style={{ color: '#9CA3AF', fontSize: '14px', lineHeight: '1.6' }}>
                  <p>Mon–Thu: 11AM – 11PM</p>
                  <p>Fri–Sat: 11AM – 12AM</p>
                  <p>Sunday: 12PM – 10PM</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p style={{ color: '#6B7280', fontSize: '13px' }}>
            © {currentYear} Rizqara Restaurant. All rights reserved.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-8" style={{ color: '#6B7280', fontSize: '13px' }}>
            <div className="flex items-center gap-1">
              Product of
              <a
                href="https://www.rizqara.tech"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#D4AF37', fontWeight: 600, marginLeft: '4px' }}
                className="hover:underline"
              >
                Rizqara Tech
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}