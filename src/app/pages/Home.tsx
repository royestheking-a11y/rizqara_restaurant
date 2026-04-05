import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router';
import {
  ChevronLeft, ChevronRight, Star, ArrowRight, Check,
  Leaf, Award, Clock, Shield, Smile, Flame, Users,
  Calendar, ShoppingCart, Eye, MapPin, Phone, ChevronDown, Quote,
} from 'lucide-react';
import { menuItems, chefs, reviews } from '../data/restaurantData';
import { useApp } from '../context/AppContext';
import { SEO } from '../components/SEO';

const heroSlides = [
  {
    image: 'https://images.unsplash.com/photo-1768697358705-c1b60333da35?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjByZXN0YXVyYW50JTIwaW50ZXJpb3IlMjBlbGVnYW50JTIwZGluaW5nfGVufDF8fHx8MTc3NTA1MzEzNHww&ixlib=rb-4.1.0&q=80&w=1080',
    subtitle: 'Premium Dining Experience',
    title: 'RIZQARA',
    titleLine2: 'RESTAURANT',
    description: 'The finest dining destination in Dhaka — where extraordinary flavors meet unmatched elegance.',
    badge: '★ Best Restaurant in Dhaka',
  },
  {
    image: 'https://images.unsplash.com/photo-1768729341078-9da4e0ea959e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMGluZ3JlZGllbnRzJTIwaGVyYnMlMjBzcGljZXMlMjBjb29raW5nfGVufDF8fHx8MTc3NTA1ODQyNHww&ixlib=rb-4.1.0&q=80&w=1080',
    subtitle: 'Nature\'s Best Ingredients',
    title: 'Authentic Taste',
    titleLine2: 'Fresh Ingredients',
    description: 'We source only the freshest, highest-quality ingredients to craft dishes that tell a story of passion and excellence.',
    badge: '✦ 100% Fresh & Natural',
  },
  {
    image: 'https://images.unsplash.com/photo-1759027044799-5aed5577f864?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYW1pbHklMjBkaW5pbmclMjByZXN0YXVyYW50JTIwYW1iaWFuY2V8ZW58MXx8fHwxNzc1MDU4NDI1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    subtitle: 'For Every Occasion',
    title: 'Perfect Place for',
    titleLine2: 'Family & Friends',
    description: 'Create unforgettable memories with the people you love, surrounded by warm hospitality and exquisite cuisine.',
    badge: '❤ Family Friendly',
  },
];

const whyChooseUs = [
  { icon: Leaf, title: 'Fresh Ingredients', desc: 'We use only the freshest, locally-sourced ingredients in every dish we prepare.', color: '#16A34A' },
  { icon: Award, title: 'Experienced Chefs', desc: 'Our culinary team brings 30+ combined years of expertise from top restaurants worldwide.', color: '#D4AF37' },
  { icon: Clock, title: 'Fast Service', desc: 'We respect your time. Expect prompt, attentive service from the moment you arrive.', color: '#2563EB' },
  { icon: Shield, title: 'Clean Environment', desc: 'Pristine, hygienic premises that exceed all health and safety standards.', color: '#7C3AED' },
  { icon: Smile, title: 'Affordable Price', desc: 'Premium dining experience without the premium price tag. Value for every taka.', color: '#6B0F0F' },
  { icon: Flame, title: 'Premium Taste', desc: 'Every dish is a masterpiece — crafted to deliver an extraordinary taste experience.', color: '#EA580C' },
];

const stats = [
  { value: '8+', label: 'Years of Excellence', icon: Award },
  { value: '50,000+', label: 'Happy Customers', icon: Users },
  { value: '120+', label: 'Menu Items', icon: Flame },
  { value: '15+', label: 'Expert Chefs', icon: Award },
];

function StarRating({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star
          key={i}
          size={size}
          fill={i <= Math.floor(rating) ? '#D4AF37' : 'none'}
          style={{ color: i <= Math.floor(rating) ? '#D4AF37' : '#D1D5DB' }}
        />
      ))}
    </div>
  );
}

export function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentReview, setCurrentReview] = useState(0);
  const [reviewTransitioning, setReviewTransitioning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const reviewIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { addToCart } = useApp();
  const navigate = useNavigate();

  const popularItems = menuItems.filter(item => item.isPopular).slice(0, 8);

  const goToSlide = (index: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide(index);
    setTimeout(() => setIsTransitioning(false), 600);
  };

  const nextSlide = () => goToSlide((currentSlide + 1) % heroSlides.length);
  const prevSlide = () => goToSlide((currentSlide - 1 + heroSlides.length) % heroSlides.length);

  const goToReview = (index: number) => {
    if (reviewTransitioning) return;
    setReviewTransitioning(true);
    setTimeout(() => {
      setCurrentReview(index);
      setReviewTransitioning(false);
    }, 300);
  };

  const nextReview = () => goToReview((currentReview + 1) % reviews.length);
  const prevReview = () => goToReview((currentReview - 1 + reviews.length) % reviews.length);

  useEffect(() => {
    intervalRef.current = setInterval(nextSlide, 5000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [currentSlide]);

  useEffect(() => {
    reviewIntervalRef.current = setInterval(nextReview, 4500);
    return () => { if (reviewIntervalRef.current) clearInterval(reviewIntervalRef.current); };
  }, [currentReview]);

  return (
    <div>
      <SEO 
        title="Best Restaurant in Dhaka"
        description="Rizqara Restaurant offers the most exquisite dining experience in Dhaka. Explore our premium Asian fusion menu, book your table online, and enjoy authentic flavors."
        keywords="Rizqara Restaurant, Best Restaurant Dhaka, Fine Dining Bangladesh, Asian Fusion Dhaka, Top Rated Restaurant Dhaka"
      />
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Restaurant",
          "name": "Rizqara Restaurant",
          "image": "https://rizqara.tech/images/about-facade.png",
          "url": "https://rizqara.tech",
          "telephone": "+8801800000000",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "M9W9+R6, Natun Bazar",
            "addressLocality": "Dhaka",
            "addressRegion": "Dhaka Division",
            "postalCode": "8200",
            "addressCountry": "BD"
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": 22.7010,
            "longitude": 90.3637
          },
          "openingHoursSpecification": [
            {
              "@type": "OpeningHoursSpecification",
              "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday"],
              "opens": "11:00",
              "closes": "23:00"
            },
            {
              "@type": "OpeningHoursSpecification",
              "dayOfWeek": ["Friday", "Saturday"],
              "opens": "11:00",
              "closes": "23:59"
            },
            {
              "@type": "OpeningHoursSpecification",
              "dayOfWeek": "Sunday",
              "opens": "12:00",
              "closes": "22:00"
            }
          ],
          "servesCuisine": ["Asian", "Fusion", "Biryani", "BBQ"],
          "priceRange": "$$",
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.9",
            "reviewCount": "1200"
          }
        })}
      </script>
      {/* HERO SECTION */}
      <section className="relative h-screen min-h-[600px] overflow-hidden">
        {heroSlides.map((slide, i) => (
          <div
            key={i}
            className="absolute inset-0 transition-all duration-700"
            style={{
              opacity: currentSlide === i ? 1 : 0,
              transform: currentSlide === i ? 'scale(1)' : 'scale(1.05)',
            }}
          >
            <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.55) 60%, rgba(0,0,0,0.7) 100%)' }} />
          </div>
        ))}

        {/* Hero Content */}
        <div className="relative z-10 flex items-center h-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-3xl">
              {/* Badge */}
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 animate-fadeInUp"
                style={{ backgroundColor: 'rgba(212,175,55,0.2)', border: '1px solid rgba(212,175,55,0.4)' }}
              >
                <span style={{ color: '#D4AF37', fontSize: '13px', fontWeight: 600 }}>
                  {heroSlides[currentSlide].badge}
                </span>
              </div>

              <p
                className="mb-2 animate-fadeInUp"
                style={{ color: 'rgba(255,255,255,0.7)', fontSize: '15px', letterSpacing: '3px', textTransform: 'uppercase', fontFamily: 'var(--font-heading)' }}
              >
                {heroSlides[currentSlide].subtitle}
              </p>

              <h1
                className="animate-fadeInUp"
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 900,
                  fontSize: 'clamp(42px, 7vw, 80px)',
                  lineHeight: 1.05,
                  color: '#ffffff',
                  textShadow: '0 4px 20px rgba(0,0,0,0.3)',
                }}
              >
                {heroSlides[currentSlide].title}
                <br />
                <span style={{ color: '#D4AF37' }}>{heroSlides[currentSlide].titleLine2}</span>
              </h1>

              <p
                className="mt-4 mb-8 animate-fadeInUp"
                style={{ color: 'rgba(255,255,255,0.85)', fontSize: '17px', lineHeight: '1.7', maxWidth: '500px' }}
              >
                {heroSlides[currentSlide].description}
              </p>

              <div className="flex flex-wrap gap-4 animate-fadeInUp">
                <Link
                  to="/reservation"
                  className="flex items-center gap-2 px-7 py-4 rounded-full font-semibold text-base transition-all hover:shadow-xl hover:-translate-y-1"
                  style={{ background: 'linear-gradient(135deg, #6B0F0F, #4A0A0A)', color: 'white', fontFamily: 'var(--font-heading)' }}
                >
                  <Calendar size={18} />
                  Book Table
                </Link>
                <Link
                  to="/menu"
                  className="flex items-center gap-2 px-7 py-4 rounded-full font-semibold text-base transition-all hover:bg-white/20 hover:-translate-y-1"
                  style={{ border: '2px solid rgba(255,255,255,0.6)', color: 'white', fontFamily: 'var(--font-heading)' }}
                >
                  View Menu
                  <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Slide Controls */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex items-center gap-3">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => goToSlide(i)}
              className="transition-all duration-300 rounded-full"
              style={{
                width: i === currentSlide ? '32px' : '8px',
                height: '8px',
                backgroundColor: i === currentSlide ? '#D4AF37' : 'rgba(255,255,255,0.5)',
              }}
            />
          ))}
        </div>

        {/* Left Arrow */}
        <button
          onClick={prevSlide}
          className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95"
          style={{ background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1.5px solid rgba(255,255,255,0.4)', boxShadow: '0 4px 20px rgba(0,0,0,0.25)' }}
          aria-label="Previous slide"
        >
          <ChevronLeft size={22} className="text-white" strokeWidth={2.5} />
        </button>

        {/* Right Arrow */}
        <button
          onClick={nextSlide}
          className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95"
          style={{ background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1.5px solid rgba(255,255,255,0.4)', boxShadow: '0 4px 20px rgba(0,0,0,0.25)' }}
          aria-label="Next slide"
        >
          <ChevronRight size={22} className="text-white" strokeWidth={2.5} />
        </button>

        {/* Scroll hint */}
        <div className="absolute bottom-8 right-8 z-10 flex flex-col items-center gap-1 animate-bounce">
          <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '11px', letterSpacing: '2px', writingMode: 'vertical-rl' }}>SCROLL</span>
          <ChevronDown size={16} style={{ color: 'rgba(255,255,255,0.6)' }} />
        </div>
      </section>

      {/* STATS BAR */}
      <section style={{ background: 'linear-gradient(135deg, #6B0F0F, #4A0A0A)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div style={{ color: '#D4AF37', fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 'clamp(28px, 4vw, 40px)' }}>
                  {stat.value}
                </div>
                <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: '14px', marginTop: '4px' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT PREVIEW */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <img
                src="/images/about-facade.png"
                alt="About Rizqara"
                className="w-full rounded-2xl object-cover shadow-2xl"
                style={{ height: '480px' }}
              />
              {/* Floating Badge */}
              <div
                className="absolute -bottom-6 -right-6 p-5 rounded-2xl shadow-xl text-center"
                style={{ background: 'linear-gradient(135deg, #6B0F0F, #4A0A0A)', color: 'white' }}
              >
                <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '24px', color: '#D4AF37' }}>EST.</div>
                <div style={{ fontSize: '18px', fontWeight: 900, color: 'white' }}>2024</div>
                <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.85)', marginTop: '2px' }}>Premiere Dining</div>
              </div>
              {/* Floating award */}
              <div
                className="absolute -top-4 -left-4 w-16 h-16 rounded-full flex items-center justify-center shadow-xl"
                style={{ background: 'linear-gradient(135deg, #D4AF37, #B8960C)' }}
              >
                <Award size={28} style={{ color: '#111' }} />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="section-line" />
                <span style={{ color: '#6B0F0F', fontSize: '14px', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', fontFamily: 'var(--font-heading)' }}>
                  Our Story
                </span>
              </div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 'clamp(28px, 4vw, 42px)', color: '#111', lineHeight: 1.2, marginBottom: '16px' }}>
                About <span style={{ color: '#6B0F0F' }}>Rizqara</span> Restaurant
              </h2>
              <p style={{ color: '#6B7280', fontSize: '16px', lineHeight: '1.8', marginBottom: '16px' }}>
                Rizqara Restaurant is a premium dining destination in Dhaka, offering a wide variety of delicious meals prepared with fresh ingredients and expert care. We are committed to delivering exceptional taste, quality service, and a comfortable dining experience for families and friends.
              </p>
              <p style={{ color: '#6B7280', fontSize: '16px', lineHeight: '1.8', marginBottom: '28px' }}>
                Founded in 2024, Rizqara has grown to become the most celebrated restaurant in Dhaka, winning multiple awards for culinary excellence and outstanding customer service.
              </p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                {['Premium Ingredients', 'Expert Chefs', 'Family Friendly', 'Online Ordering'].map(feature => (
                  <div key={feature} className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(107,15,15,0.1)' }}>
                      <Check size={12} style={{ color: '#6B0F0F' }} />
                    </div>
                    <span style={{ fontSize: '14px', color: '#374151', fontWeight: 500 }}>{feature}</span>
                  </div>
                ))}
              </div>

              <Link
                to="/about"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-white transition-all hover:shadow-lg hover:-translate-y-0.5"
                style={{ background: 'linear-gradient(135deg, #6B0F0F, #4A0A0A)', fontFamily: 'var(--font-heading)' }}
              >
                Read More About Us
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* POPULAR MENU */}
      <section className="py-20 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#F9F5F0' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="section-line" />
              <span style={{ color: '#6B0F0F', fontSize: '14px', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', fontFamily: 'var(--font-heading)' }}>
                Crowd Favorites
              </span>
              <div className="section-line" />
            </div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 'clamp(28px, 4vw, 42px)', color: '#111', marginBottom: '12px' }}>
              Popular Menu Items
            </h2>
            <p style={{ color: '#6B7280', fontSize: '16px', maxWidth: '500px', margin: '0 auto' }}>
              Discover our most-loved dishes, crafted to perfection by our expert culinary team.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {popularItems.map(item => (
              <div
                key={item.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm card-hover group"
                style={{ border: '1px solid rgba(107,15,15,0.06)' }}
              >
                <div className="relative overflow-hidden" style={{ height: 'clamp(110px, 30vw, 192px)' }}>
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  {/* Badges */}
                  <div className="absolute top-2 left-2 flex gap-1">
                    {item.isPopular && (
                      <span className="premium-badge" style={{ fontSize: '9px', padding: '1px 6px' }}>Popular</span>
                    )}
                    {item.isVeg && (
                      <span className="px-1.5 py-0.5 rounded-full text-white" style={{ backgroundColor: '#16A34A', fontSize: '9px', fontWeight: 600 }}>
                        Veg
                      </span>
                    )}
                  </div>
                  {/* Quick view button */}
                  <div className="absolute inset-x-0 bottom-2 flex justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                    <button
                      onClick={() => navigate(`/menu/${item.slug}`)}
                      className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-full text-white text-xs font-semibold"
                      style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.4)' }}
                    >
                      <Eye size={12} /> Quick View
                    </button>
                  </div>
                </div>

                <div className="p-2.5 sm:p-4">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="flex-1 pr-1" style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 'clamp(11px, 3vw, 15px)', color: '#111', lineHeight: 1.3 }}>
                      {item.name}
                    </h3>
                    <span style={{ fontWeight: 700, fontSize: 'clamp(11px, 3vw, 15px)', color: '#6B0F0F', fontFamily: 'var(--font-heading)', whiteSpace: 'nowrap', marginLeft: '4px' }}>
                      ৳{item.price}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 mb-2">
                    <StarRating rating={item.rating} size={10} />
                    <span style={{ fontSize: '10px', color: '#6B7280' }}>({item.reviewCount})</span>
                  </div>

                  <p style={{ fontSize: '13px', color: '#6B7280', lineHeight: '1.5', marginBottom: '10px' }} className="line-clamp-2 hidden sm:block">
                    {item.description.substring(0, 72)}...
                  </p>

                  <div className="flex gap-1.5 sm:gap-2">
                    <button
                      onClick={() => navigate(`/menu/${item.slug}`)}
                      className="flex-1 rounded-lg font-semibold border transition-all hover:shadow-sm"
                      style={{ borderColor: '#6B0F0F', color: '#6B0F0F', fontFamily: 'var(--font-heading)', fontSize: 'clamp(9px, 2.5vw, 12px)', padding: 'clamp(5px, 1.5vw, 8px) 4px' }}
                    >
                      View
                    </button>
                    <button
                      onClick={() => addToCart(item)}
                      className="flex-1 rounded-lg font-semibold text-white transition-all hover:shadow-md hover:-translate-y-0.5"
                      style={{ background: 'linear-gradient(135deg, #6B0F0F, #4A0A0A)', fontFamily: 'var(--font-heading)', fontSize: 'clamp(9px, 2.5vw, 12px)', padding: 'clamp(5px, 1.5vw, 8px) 4px' }}
                    >
                      + Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-white transition-all hover:shadow-xl hover:-translate-y-1"
              style={{ background: 'linear-gradient(135deg, #6B0F0F, #4A0A0A)', fontFamily: 'var(--font-heading)' }}
            >
              Explore Full Menu
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="section-line" />
              <span style={{ color: '#6B0F0F', fontSize: '14px', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', fontFamily: 'var(--font-heading)' }}>
                Our Promise
              </span>
              <div className="section-line" />
            </div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 'clamp(28px, 4vw, 42px)', color: '#111', marginBottom: '12px' }}>
              Why Choose <span style={{ color: '#6B0F0F' }}>Rizqara?</span>
            </h2>
            <p style={{ color: '#6B7280', fontSize: '16px', maxWidth: '500px', margin: '0 auto' }}>
              We don't just serve food — we create extraordinary experiences that keep you coming back.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyChooseUs.map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={i}
                  className="p-7 rounded-2xl border card-hover group"
                  style={{ borderColor: 'rgba(107,15,15,0.08)', backgroundColor: '#fff' }}
                >
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-all group-hover:scale-110"
                    style={{ backgroundColor: `${item.color}15` }}
                  >
                    <Icon size={26} style={{ color: item.color }} />
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '18px', color: '#111', marginBottom: '8px' }}>
                    {item.title}
                  </h3>
                  <p style={{ color: '#6B7280', fontSize: '14px', lineHeight: '1.7' }}>
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CHEFS SECTION */}
      <section className="py-20 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#F9F5F0' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="section-line" />
              <span style={{ color: '#6B0F0F', fontSize: '14px', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', fontFamily: 'var(--font-heading)' }}>
                The Culinary Team
              </span>
              <div className="section-line" />
            </div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 'clamp(28px, 4vw, 42px)', color: '#111', marginBottom: '12px' }}>
              Meet Our <span style={{ color: '#6B0F0F' }}>Expert Chefs</span>
            </h2>
            <p style={{ color: '#6B7280', fontSize: '16px', maxWidth: '500px', margin: '0 auto' }}>
              The talented artists behind every dish — passionate, skilled, and dedicated to culinary excellence.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {chefs.map(chef => (
              <div key={chef.id} className="text-center group">
                <div className="relative inline-block mb-5">
                  <div
                    className="w-40 h-40 sm:w-48 sm:h-48 rounded-full overflow-hidden mx-auto shadow-xl border-4 transition-all duration-300 group-hover:shadow-2xl"
                    style={{ borderColor: 'rgba(212,175,55,0.4)' }}
                  >
                    <img
                      src={chef.image}
                      alt={chef.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div
                    className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full flex items-center justify-center shadow-lg"
                    style={{ background: 'linear-gradient(135deg, #D4AF37, #B8960C)' }}
                  >
                    <Award size={16} style={{ color: '#111' }} />
                  </div>
                </div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '20px', color: '#111', marginBottom: '4px' }}>
                  {chef.name}
                </h3>
                <p style={{ color: '#6B0F0F', fontWeight: 600, fontSize: '14px', marginBottom: '4px', fontFamily: 'var(--font-heading)' }}>
                  {chef.position}
                </p>
                <p style={{ color: '#D4AF37', fontSize: '13px', fontWeight: 600, marginBottom: '10px' }}>
                  {chef.experience} • {chef.speciality}
                </p>
                <p style={{ color: '#6B7280', fontSize: '14px', lineHeight: '1.6', maxWidth: '280px', margin: '0 auto' }}>
                  {chef.bio.substring(0, 100)}...
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY PREVIEW */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="section-line" />
                <span style={{ color: '#6B0F0F', fontSize: '14px', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', fontFamily: 'var(--font-heading)' }}>
                  Visual Journey
                </span>
              </div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 'clamp(28px, 4vw, 42px)', color: '#111' }}>
                Our <span style={{ color: '#6B0F0F' }}>Gallery</span>
              </h2>
            </div>
            <Link
              to="/gallery"
              className="hidden sm:flex items-center gap-2 text-sm font-semibold transition-all hover:-translate-x-1"
              style={{ color: '#6B0F0F', fontFamily: 'var(--font-heading)' }}
            >
              View All <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { url: 'https://images.unsplash.com/photo-1768697358705-c1b60333da35?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjByZXN0YXVyYW50JTIwaW50ZXJpb3IlMjBlbGVnYW50JTIwZGluaW5nfGVufDF8fHx8MTc3NTA1MzEzNHww&ixlib=rb-4.1.0&q=80&w=1080', title: 'Dining Hall', span: 'col-span-2 row-span-2' },
              { url: 'https://images.unsplash.com/photo-1599043513900-ed6fe01d3833?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaXJ5YW5pJTIwcmljZSUyMHNhZmZyb24lMjBzcGljZWR8ZW58MXx8fHwxNzc1MDU4NDMzfDA&ixlib=rb-4.1.0&q=80&w=1080', title: 'Kacchi Biryani', span: '' },
              { url: 'https://images.unsplash.com/photo-1763429338698-439aa108e7fb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwZXZlbnQlMjBjZWxlYnJhdGlvbiUyMGhhbGwlMjBzZXR1cHxlbnwxfHx8fDE3NzUwNTg0MzV8MA&ixlib=rb-4.1.0&q=80&w=1080', title: 'Events', span: '' },
              { url: 'https://images.unsplash.com/photo-1722554085769-8ad416331d48?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxCQlElMjBwbGF0dGVyJTIwbWl4ZWQlMjBncmlsbCUyMHBsYXR0ZXJ8ZW58MXx8fHwxNzc1MDU4NDI4fDA&ixlib=rb-4.1.0&q=80&w=1080', title: 'BBQ Platter', span: '' },
              { url: 'https://images.unsplash.com/photo-1688458296817-3f9c4fba4809?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNzZXJ0JTIwY2hvY29sYXRlJTIwY2FrZSUyMHByZW1pdW0lMjBwbGF0aW5nfGVufDF8fHx8MTc3NTA1ODQzNXww&ixlib=rb-4.1.0&q=80&w=1080', title: 'Dessert Art', span: '' },
            ].map((img, i) => (
              <Link
                key={i}
                to="/gallery"
                className={`relative overflow-hidden rounded-2xl group ${img.span}`}
                style={{ height: i === 0 ? '320px' : '150px' }}
              >
                <img src={img.url} alt={img.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-end p-4">
                  <span
                    className="text-white text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {img.title}
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-8 sm:hidden">
            <Link
              to="/gallery"
              className="inline-flex items-center gap-2 text-sm font-semibold"
              style={{ color: '#6B0F0F', fontFamily: 'var(--font-heading)' }}
            >
              View All Gallery <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="py-20 px-4 sm:px-6 lg:px-8" style={{ background: 'linear-gradient(135deg, #6B0F0F 0%, #4A0A0A 100%)' }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div style={{ width: '60px', height: '3px', background: 'linear-gradient(90deg, #D4AF37, rgba(212,175,55,0.3))', borderRadius: '2px' }} />
              <span style={{ color: '#D4AF37', fontSize: '14px', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', fontFamily: 'var(--font-heading)' }}>
                Testimonials
              </span>
              <div style={{ width: '60px', height: '3px', background: 'linear-gradient(270deg, #D4AF37, rgba(212,175,55,0.3))', borderRadius: '2px' }} />
            </div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 'clamp(28px, 4vw, 42px)', color: '#ffffff', marginBottom: '8px' }}>
              What Our Guests Say
            </h2>
            <div className="flex items-center justify-center gap-2 mt-3">
              <StarRating rating={5} size={18} />
              <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '15px' }}>4.9/5 from 1,200+ reviews</span>
            </div>
          </div>

          {/* Carousel */}
          <div className="relative">
            {/* Card */}
            <div
              className="p-8 sm:p-10 rounded-3xl relative overflow-hidden"
              style={{
                background: 'rgba(255,255,255,0.08)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(255,255,255,0.12)',
                boxShadow: '0 24px 64px rgba(0,0,0,0.3)',
                transition: 'opacity 0.3s ease, transform 0.3s ease',
                opacity: reviewTransitioning ? 0 : 1,
                transform: reviewTransitioning ? 'translateY(10px)' : 'translateY(0)',
              }}
            >
              {/* Big quote */}
              <Quote
                size={64}
                className="absolute top-6 right-8 opacity-10"
                style={{ color: '#D4AF37' }}
              />

              {/* Stars */}
              <div className="mb-5">
                <StarRating rating={reviews[currentReview].rating} size={20} />
              </div>

              {/* Comment */}
              <p style={{
                color: 'rgba(255,255,255,0.9)',
                fontSize: 'clamp(15px, 2vw, 18px)',
                lineHeight: '1.8',
                fontStyle: 'italic',
                marginBottom: '28px',
                minHeight: '90px',
              }}>
                "{reviews[currentReview].comment}"
              </p>

              {/* Author */}
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-bold flex-shrink-0 shadow-lg"
                    style={{ background: 'linear-gradient(135deg, #D4AF37, #B8960C)', fontFamily: 'var(--font-heading)' }}
                  >
                    {reviews[currentReview].name.charAt(0)}
                  </div>
                  <div>
                    <p style={{ color: 'white', fontWeight: 700, fontSize: '16px', fontFamily: 'var(--font-heading)' }}>
                      {reviews[currentReview].name}
                    </p>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', marginTop: '2px' }}>
                      {reviews[currentReview].location}
                    </p>
                  </div>
                </div>

                {/* Counter */}
                <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px', fontFamily: 'var(--font-heading)', fontWeight: 600 }}>
                  {currentReview + 1} / {reviews.length}
                </span>
              </div>
            </div>

            {/* Prev / Next Arrows */}
            <button
              onClick={() => { if (reviewIntervalRef.current) clearInterval(reviewIntervalRef.current); prevReview(); }}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 w-11 h-11 rounded-full flex items-center justify-center transition-all hover:scale-110"
              style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)', color: 'white' }}
              aria-label="Previous review"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => { if (reviewIntervalRef.current) clearInterval(reviewIntervalRef.current); nextReview(); }}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-5 w-11 h-11 rounded-full flex items-center justify-center transition-all hover:scale-110"
              style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)', color: 'white' }}
              aria-label="Next review"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Dot Indicators */}
          <div className="flex items-center justify-center gap-2.5 mt-8">
            {reviews.map((_, i) => (
              <button
                key={i}
                onClick={() => { if (reviewIntervalRef.current) clearInterval(reviewIntervalRef.current); goToReview(i); }}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === currentReview ? '28px' : '8px',
                  height: '8px',
                  background: i === currentReview ? '#D4AF37' : 'rgba(255,255,255,0.25)',
                }}
                aria-label={`Go to review ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* RESERVATION SECTION */}
      <section id="reservation" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="section-line" />
              <span style={{ color: '#6B0F0F', fontSize: '14px', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', fontFamily: 'var(--font-heading)' }}>
                Book Your Table
              </span>
              <div className="section-line" />
            </div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 'clamp(28px, 4vw, 42px)', color: '#111', marginBottom: '12px' }}>
              Reserve Your <span style={{ color: '#6B0F0F' }}>Experience</span>
            </h2>
            <p style={{ color: '#6B7280', fontSize: '16px', maxWidth: '460px', margin: '0 auto' }}>
              Book your table now and we'll prepare an unforgettable experience just for you.
            </p>
          </div>

          <div
            className="p-8 sm:p-10 rounded-3xl shadow-xl"
            style={{ background: 'linear-gradient(135deg, #6B0F0F, #4A0A0A)' }}
          >
            <QuickReservationForm />
          </div>
        </div>
      </section>

      {/* MAP SECTION */}
      <section className="py-16 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#F9F5F0' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="section-line" />
              <span style={{ color: '#6B0F0F', fontSize: '14px', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', fontFamily: 'var(--font-heading)' }}>
                Find Us
              </span>
              <div className="section-line" />
            </div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 'clamp(24px, 3vw, 36px)', color: '#111' }}>
              Visit Us in <span style={{ color: '#6B0F0F' }}>Dhaka</span>
            </h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 rounded-2xl overflow-hidden shadow-xl" style={{ height: '380px' }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3687.0!2d90.3637!3d22.7010!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3754b2f2e11d2b7b%3A0x0!2sM9W9%2BR6%2C+Dhaka%2C+Bangladesh!5e0!3m2!1sen!2sbd!4v1680000000000!5m2!1sen!2sbd"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                title="Rizqara Restaurant Location"
              />
            </div>

            <div className="space-y-4">
              {[
                { icon: MapPin, title: 'Address', content: 'M9W9+R6, Natun Bazar, Dhaka, Bangladesh' },
                { icon: Phone, title: 'Phone', content: '+880 1800-000000\n+880 1900-000000' },
                { icon: Clock, title: 'Opening Hours', content: 'Mon–Thu: 11AM – 11PM\nFri–Sat: 11AM – 12AM\nSunday: 12PM – 10PM' },
              ].map(({ icon: Icon, title, content }) => (
                <div
                  key={title}
                  className="p-5 rounded-2xl flex gap-4"
                  style={{ backgroundColor: '#fff', border: '1px solid rgba(107,15,15,0.08)', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}
                >
                  <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(107,15,15,0.08)' }}>
                    <Icon size={18} style={{ color: '#6B0F0F' }} />
                  </div>
                  <div>
                    <h4 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '14px', color: '#111', marginBottom: '4px' }}>{title}</h4>
                    <p style={{ fontSize: '13px', color: '#6B7280', whiteSpace: 'pre-line', lineHeight: '1.6' }}>{content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'repeating-linear-gradient(45deg, #6B0F0F 0px, #6B0F0F 1px, transparent 1px, transparent 50px)',
          }}
        />
        <div className="max-w-4xl mx-auto text-center relative">
          <div className="mb-4 flex justify-center">
            <span className="px-4 py-1.5 rounded-full text-sm font-semibold" style={{ backgroundColor: 'rgba(107,15,15,0.08)', color: '#6B0F0F', fontFamily: 'var(--font-heading)' }}>
              ★ Limited Slots Available
            </span>
          </div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 'clamp(28px, 5vw, 52px)', color: '#111', lineHeight: 1.15, marginBottom: '16px' }}>
            Ready for an <span style={{ color: '#6B0F0F' }}>Extraordinary</span> <br />Dining Experience?
          </h2>
          <p style={{ color: '#6B7280', fontSize: '17px', maxWidth: '500px', margin: '0 auto 32px', lineHeight: '1.7' }}>
            Join thousands of satisfied guests who have made Rizqara their favorite dining destination in Dhaka.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/reservation"
              className="flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-white transition-all hover:shadow-xl hover:-translate-y-1"
              style={{ background: 'linear-gradient(135deg, #6B0F0F, #4A0A0A)', fontFamily: 'var(--font-heading)' }}
            >
              <Calendar size={20} />
              Book a Table
            </Link>
            <Link
              to="/menu"
              className="flex items-center gap-2 px-8 py-4 rounded-full font-semibold transition-all hover:shadow-lg hover:-translate-y-1"
              style={{ background: 'linear-gradient(135deg, #D4AF37, #B8960C)', color: '#111', fontFamily: 'var(--font-heading)' }}
            >
              <ShoppingCart size={20} />
              Order Online
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function QuickReservationForm() {
  const { dispatch, showNotification } = useApp();
  const [form, setForm] = useState({ name: '', phone: '', date: '', time: '', guests: '2' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const reservation = {
        id: Date.now().toString(),
        ...form,
        email: '',
        guests: parseInt(form.guests),
        specialRequest: '',
        status: 'Pending' as const,
        createdAt: new Date().toISOString(),
      };
      dispatch({ type: 'ADD_RESERVATION', payload: reservation });
      showNotification('Table booked successfully! We\'ll confirm shortly.', 'success');
      setForm({ name: '', phone: '', date: '', time: '', guests: '2' });
      setLoading(false);
    }, 1200);
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '12px',
    background: 'rgba(255,255,255,0.12)',
    border: '1px solid rgba(255,255,255,0.25)',
    color: 'white',
    fontSize: '14px',
    outline: 'none',
    fontFamily: 'var(--font-body)',
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label style={{ color: 'rgba(255,255,255,0.8)', fontSize: '13px', fontWeight: 500, display: 'block', marginBottom: '6px', fontFamily: 'var(--font-heading)' }}>
            Full Name *
          </label>
          <input
            type="text"
            required
            placeholder="Your name"
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            style={inputStyle}
          />
        </div>
        <div>
          <label style={{ color: 'rgba(255,255,255,0.8)', fontSize: '13px', fontWeight: 500, display: 'block', marginBottom: '6px', fontFamily: 'var(--font-heading)' }}>
            Phone Number *
          </label>
          <input
            type="tel"
            required
            placeholder="+880 1XXXXXXXXX"
            value={form.phone}
            onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
            style={inputStyle}
          />
        </div>
        <div>
          <label style={{ color: 'rgba(255,255,255,0.8)', fontSize: '13px', fontWeight: 500, display: 'block', marginBottom: '6px', fontFamily: 'var(--font-heading)' }}>
            Date *
          </label>
          <input
            type="date"
            required
            value={form.date}
            onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
            style={inputStyle}
            min={new Date().toISOString().split('T')[0]}
          />
        </div>
        <div>
          <label style={{ color: 'rgba(255,255,255,0.8)', fontSize: '13px', fontWeight: 500, display: 'block', marginBottom: '6px', fontFamily: 'var(--font-heading)' }}>
            Time *
          </label>
          <select
            required
            value={form.time}
            onChange={e => setForm(f => ({ ...f, time: e.target.value }))}
            style={{ ...inputStyle, cursor: 'pointer' }}
          >
            <option value="" style={{ background: '#2d0808' }}>Select time</option>
            {['11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM', '10:00 PM'].map(t => (
              <option key={t} value={t} style={{ background: '#2d0808' }}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-6">
        <label style={{ color: 'rgba(255,255,255,0.8)', fontSize: '13px', fontWeight: 500, display: 'block', marginBottom: '8px', fontFamily: 'var(--font-heading)' }}>
          Number of Guests
        </label>
        <div className="flex gap-2 flex-wrap">
          {['1', '2', '3', '4', '5', '6', '8', '10+'].map(n => (
            <button
              key={n}
              type="button"
              onClick={() => setForm(f => ({ ...f, guests: n }))}
              className="px-4 py-2 rounded-xl text-sm font-semibold transition-all"
              style={{
                background: form.guests === n ? 'linear-gradient(135deg, #D4AF37, #B8960C)' : 'rgba(255,255,255,0.1)',
                color: form.guests === n ? '#111' : 'rgba(255,255,255,0.8)',
                border: '1px solid',
                borderColor: form.guests === n ? 'transparent' : 'rgba(255,255,255,0.2)',
                fontFamily: 'var(--font-heading)',
              }}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 rounded-full font-semibold text-base transition-all hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-70"
        style={{ background: 'linear-gradient(135deg, #D4AF37, #B8960C)', color: '#111', fontFamily: 'var(--font-heading)' }}
      >
        {loading ? 'Booking...' : '✦ Confirm Reservation'}
      </button>
    </form>
  );
}