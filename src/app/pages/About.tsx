import { Link } from 'react-router';
import { Award, Users, Flame, Star, Check, ArrowRight } from 'lucide-react';
import { chefs } from '../data/restaurantData';

export function About() {
  const milestones = [
    { year: '2024', title: 'Grand Opening', desc: 'Rizqara Restaurant opened its doors in Barishal with a vision for premium dining.' },
    { year: '2024', title: 'First Award', desc: 'Won "Best New Restaurant in Barishal" at the Regional Food Excellence Awards.' },
    { year: '2025', title: 'Innovation', desc: 'Launched our state-of-the-art kitchen and added a dedicated catering wing.' },
    { year: '2026', title: '#1 Status', desc: 'Recognized as the #1 premium dining destination in Barishal by 10,000+ customer reviews.' },
  ];

  const values = [
    { icon: Flame, title: 'Passion for Food', desc: 'Every dish is prepared with genuine love and dedication to culinary excellence.' },
    { icon: Star, title: 'Uncompromising Quality', desc: 'We never compromise on the quality of our ingredients or preparation methods.' },
    { icon: Users, title: 'Guest Experience', desc: 'Your satisfaction and comfort are at the heart of everything we do.' },
    { icon: Award, title: 'Continuous Innovation', desc: 'We constantly evolve our menu to bring you exciting new culinary experiences.' },
  ];

  return (
    <div style={{ paddingTop: '80px', minHeight: '100vh' }}>
      {/* Hero */}
      <div className="relative py-24 px-4 text-center overflow-hidden" style={{ background: 'linear-gradient(135deg, #6B0F0F, #4A0A0A)' }}>
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 30% 70%, #D4AF37 0%, transparent 50%), radial-gradient(circle at 70% 30%, #D4AF37 0%, transparent 50%)' }} />
        <div className="relative max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div style={{ width: '40px', height: '2px', backgroundColor: 'rgba(212,175,55,0.5)' }} />
            <span style={{ color: '#D4AF37', fontSize: '13px', fontWeight: 600, letterSpacing: '3px', textTransform: 'uppercase', fontFamily: 'var(--font-heading)' }}>Our Story</span>
            <div style={{ width: '40px', height: '2px', backgroundColor: 'rgba(212,175,55,0.5)' }} />
          </div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 'clamp(36px, 5vw, 60px)', color: '#fff', marginBottom: '16px', lineHeight: 1.1 }}>
            About <span style={{ color: '#D4AF37' }}>Rizqara</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '17px', lineHeight: '1.7' }}>
            A story of passion, excellence, and an unwavering commitment to delivering the finest dining experience in Barishal.
          </p>
        </div>
      </div>

      {/* Story Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <div className="relative">
              <img
                src="/images/about-facade.png"
                alt="Rizqara Restaurant Interior"
                className="w-full rounded-3xl object-cover shadow-2xl"
                style={{ height: '520px' }}
              />
              <div
                className="absolute -bottom-8 right-8 p-6 rounded-2xl shadow-xl text-white text-center"
                style={{ background: 'linear-gradient(135deg, #D4AF37, #B8960C)', color: '#111' }}
              >
                <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '32px', lineHeight: 1 }}>EST.</div>
                <div style={{ fontSize: '24px', fontWeight: 900, marginTop: '2px' }}>2024</div>
                <div style={{ fontSize: '11px', fontWeight: 700, marginTop: '4px', textTransform: 'uppercase' }}>Premiere Dining</div>
              </div>
            </div>

            <div className="pt-8 lg:pt-0">
              <div className="flex items-center gap-3 mb-4">
                <div className="section-line" />
                <span style={{ color: '#6B0F0F', fontSize: '14px', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', fontFamily: 'var(--font-heading)' }}>Who We Are</span>
              </div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 'clamp(28px, 4vw, 42px)', color: '#111', lineHeight: 1.2, marginBottom: '20px' }}>
                Barishal's Premier <span style={{ color: '#6B0F0F' }}>Dining Experience</span>
              </h2>
              <div className="space-y-4" style={{ color: '#6B7280', fontSize: '15px', lineHeight: '1.8' }}>
                <p>
                  Rizqara Restaurant was founded in 2024 with a simple yet powerful vision: to bring world-class dining to the heart of Barishal. What started as a small restaurant with big dreams has grown into the most celebrated dining destination in the region.
                </p>
                <p>
                  Our name "Rizqara" reflects our philosophy — every plate we serve is a blessing, crafted with gratitude and care. We believe that exceptional food has the power to bring people together, create memories, and nourish the soul.
                </p>
                <p>
                  Today, with over 50,000 satisfied guests, multiple culinary awards, and a team of internationally trained chefs, Rizqara stands as a testament to what passion and dedication can achieve.
                </p>
              </div>

              <div className="mt-8 space-y-3">
                {['Internationally trained culinary team', 'Award-winning restaurant since 2019', 'Locally sourced, premium ingredients', 'State-of-the-art kitchen facilities', 'Full-service catering for all occasions'].map(point => (
                  <div key={point} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, #6B0F0F, #D4AF37)' }}>
                      <Check size={12} className="text-white" />
                    </div>
                    <span style={{ fontSize: '14px', color: '#374151', fontWeight: 500 }}>{point}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#F9F5F0' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="section-line" />
              <span style={{ color: '#6B0F0F', fontSize: '14px', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', fontFamily: 'var(--font-heading)' }}>What Drives Us</span>
              <div className="section-line" />
            </div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 'clamp(28px, 4vw, 40px)', color: '#111' }}>
              Our Core <span style={{ color: '#6B0F0F' }}>Values</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="text-center p-7 bg-white rounded-2xl shadow-sm card-hover" style={{ border: '1px solid rgba(107,15,15,0.06)' }}>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'linear-gradient(135deg, rgba(107,15,15,0.1), rgba(212,175,55,0.1))' }}>
                  <Icon size={26} style={{ color: '#6B0F0F' }} />
                </div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '17px', color: '#111', marginBottom: '8px' }}>{title}</h3>
                <p style={{ color: '#6B7280', fontSize: '14px', lineHeight: '1.6' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline / Milestones */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="section-line" />
              <span style={{ color: '#6B0F0F', fontSize: '14px', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', fontFamily: 'var(--font-heading)' }}>Our Journey</span>
              <div className="section-line" />
            </div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 'clamp(28px, 4vw, 40px)', color: '#111' }}>
              Milestones & <span style={{ color: '#6B0F0F' }}>Achievements</span>
            </h2>
          </div>
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-0.5" style={{ background: 'linear-gradient(180deg, #6B0F0F, #D4AF37, #6B0F0F)' }} />
            <div className="space-y-8">
              {milestones.map((m, i) => (
                <div key={m.year} className="flex gap-8 items-start">
                  <div
                    className="relative z-10 w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg"
                    style={{ background: i % 2 === 0 ? 'linear-gradient(135deg, #6B0F0F, #4A0A0A)' : 'linear-gradient(135deg, #D4AF37, #B8960C)' }}
                  >
                    <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '11px', color: i % 2 === 0 ? 'white' : '#111' }}>{m.year}</span>
                  </div>
                  <div className="flex-1 py-2">
                    <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '18px', color: '#111', marginBottom: '6px' }}>{m.title}</h3>
                    <p style={{ color: '#6B7280', fontSize: '14px', lineHeight: '1.6' }}>{m.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Chefs */}
      <section className="py-20 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#F9F5F0' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="section-line" />
              <span style={{ color: '#6B0F0F', fontSize: '14px', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', fontFamily: 'var(--font-heading)' }}>The Team</span>
              <div className="section-line" />
            </div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 'clamp(28px, 4vw, 40px)', color: '#111' }}>
              Our Expert <span style={{ color: '#6B0F0F' }}>Chefs</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {chefs.map(chef => (
              <div key={chef.id} className="bg-white rounded-3xl overflow-hidden shadow-sm card-hover" style={{ border: '1px solid rgba(107,15,15,0.06)' }}>
                <div className="h-64 overflow-hidden">
                  <img src={chef.image} alt={chef.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-6">
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '20px', color: '#111', marginBottom: '4px' }}>{chef.name}</h3>
                  <p style={{ color: '#6B0F0F', fontWeight: 600, fontSize: '14px', marginBottom: '4px', fontFamily: 'var(--font-heading)' }}>{chef.position}</p>
                  <p style={{ color: '#D4AF37', fontSize: '13px', marginBottom: '12px' }}>{chef.experience} • {chef.speciality}</p>
                  <p style={{ color: '#6B7280', fontSize: '14px', lineHeight: '1.6' }}>{chef.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 text-center" style={{ background: 'linear-gradient(135deg, #6B0F0F, #4A0A0A)' }}>
        <div className="max-w-2xl mx-auto">
          <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 'clamp(28px, 4vw, 42px)', color: '#fff', marginBottom: '16px' }}>
            Experience Rizqara <span style={{ color: '#D4AF37' }}>Today</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '16px', marginBottom: '28px', lineHeight: '1.7' }}>
            Join thousands of satisfied guests and discover why Rizqara is Barishal's most loved restaurant.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/reservation"
              className="flex items-center gap-2 px-8 py-4 rounded-full font-semibold transition-all hover:shadow-xl hover:-translate-y-0.5"
              style={{ background: 'linear-gradient(135deg, #D4AF37, #B8960C)', color: '#111', fontFamily: 'var(--font-heading)' }}
            >
              Book a Table <ArrowRight size={18} />
            </Link>
            <Link
              to="/menu"
              className="flex items-center gap-2 px-8 py-4 rounded-full font-semibold border-2 transition-all hover:-translate-y-0.5"
              style={{ borderColor: 'rgba(255,255,255,0.5)', color: 'white', fontFamily: 'var(--font-heading)' }}
            >
              View Our Menu
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
