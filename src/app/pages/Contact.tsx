import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, MessageCircle, Send, Check, Facebook, Instagram } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SEO } from '../components/SEO';

export function Contact() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { dispatch, showNotification } = useApp();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const msg = {
        id: Date.now().toString(),
        ...form,
        createdAt: new Date().toISOString(),
        isRead: false,
      };
      dispatch({ type: 'ADD_MESSAGE', payload: msg });
      setSuccess(true);
      setLoading(false);
      showNotification('Message sent! We\'ll reply within 24 hours.', 'success');
    }, 1500);
  };

  const inputStyle = {
    width: '100%',
    padding: '14px 16px',
    borderRadius: '12px',
    border: '1.5px solid rgba(107,15,15,0.15)',
    fontSize: '14px',
    fontFamily: 'var(--font-body)',
    outline: 'none',
    color: '#111',
    backgroundColor: 'white',
  };

  return (
    <div style={{ paddingTop: '80px', minHeight: '100vh' }}>
      <SEO 
        title="Contact Us - Visit Us in Barishal"
        description="Find our location in Barishal, check our opening hours, or send us a message. We are here to assist with your reservations and catering needs."
        keywords="Contact Rizqara, Restaurant Location Barishal, Opening Hours, Reservation Help, Customer Support"
      />
      {/* Header */}
      <div className="py-20 px-4 text-center relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #6B0F0F, #4A0A0A)' }}>
        <div className="absolute inset-0 opacity-15" style={{ backgroundImage: 'radial-gradient(circle at 60% 40%, #D4AF37 0%, transparent 60%)' }} />
        <div className="relative">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div style={{ width: '40px', height: '2px', backgroundColor: 'rgba(212,175,55,0.5)' }} />
            <span style={{ color: '#D4AF37', fontSize: '13px', fontWeight: 600, letterSpacing: '3px', textTransform: 'uppercase', fontFamily: 'var(--font-heading)' }}>Get in Touch</span>
            <div style={{ width: '40px', height: '2px', backgroundColor: 'rgba(212,175,55,0.5)' }} />
          </div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 'clamp(32px, 5vw, 56px)', color: '#fff', marginBottom: '12px' }}>Contact Us</h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '16px', maxWidth: '400px', margin: '0 auto' }}>
            Have a question or feedback? We'd love to hear from you.
          </p>
        </div>
      </div>

      {/* Quick Contact Cards */}
      <section className="py-12 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#F9F5F0' }}>
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Phone, label: 'Phone', value: '+880 1800-000000', sub: 'Mon–Sat, 10AM–10PM', href: 'tel:+8801800000000', color: '#6B0F0F' },
            { icon: MessageCircle, label: 'WhatsApp', value: '+880 1900-000000', sub: 'Quick Response', href: 'https://wa.me/8801900000000', color: '#25D366' },
            { icon: Mail, label: 'Email', value: 'info@rizqara.com', sub: 'Reply within 24h', href: 'mailto:info@rizqara.com', color: '#2563EB' },
            { icon: MapPin, label: 'Address', value: 'M9W9+R6, Barishal', sub: 'Bangladesh', href: '#map', color: '#7C3AED' },
          ].map(({ icon: Icon, label, value, sub, href, color }) => (
            <a
              key={label}
              href={href}
              className="flex flex-col items-center text-center p-6 rounded-2xl bg-white card-hover"
              style={{ border: '1px solid rgba(107,15,15,0.08)', textDecoration: 'none' }}
            >
              <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3" style={{ backgroundColor: `${color}15` }}>
                <Icon size={22} style={{ color }} />
              </div>
              <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '14px', color: '#111', marginBottom: '4px' }}>{label}</span>
              <span style={{ fontSize: '13px', color: '#6B0F0F', fontWeight: 600, marginBottom: '2px' }}>{value}</span>
              <span style={{ fontSize: '12px', color: '#6B7280' }}>{sub}</span>
            </a>
          ))}
        </div>
      </section>

      {/* Contact Form + Info */}
      <section className="py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-5 gap-10">
          {/* Info */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '26px', color: '#111', marginBottom: '12px' }}>
                We're Here to <span style={{ color: '#6B0F0F' }}>Help</span>
              </h2>
              <p style={{ color: '#6B7280', fontSize: '15px', lineHeight: '1.7' }}>
                Whether you have a question about our menu, want to make a reservation, or need catering services — our team is ready to assist you.
              </p>
            </div>

            <div className="p-6 rounded-2xl" style={{ background: 'linear-gradient(135deg, #6B0F0F, #4A0A0A)' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '16px', color: '#D4AF37', marginBottom: '14px' }}>
                Opening Hours
              </h3>
              {[
                { day: 'Monday – Thursday', time: '11:00 AM – 11:00 PM' },
                { day: 'Friday – Saturday', time: '11:00 AM – 12:00 AM' },
                { day: 'Sunday', time: '12:00 PM – 10:00 PM' },
              ].map(({ day, time }) => (
                <div key={day} className="flex justify-between py-2.5 border-b" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
                  <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)' }}>{day}</span>
                  <span style={{ fontSize: '13px', color: '#D4AF37', fontWeight: 600 }}>{time}</span>
                </div>
              ))}
            </div>

            <div className="p-5 rounded-2xl" style={{ backgroundColor: '#F9F5F0', border: '1px solid rgba(107,15,15,0.08)' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '15px', color: '#111', marginBottom: '10px' }}>
                Follow Us
              </h3>
              <div className="flex gap-3">
                {[
                  { icon: Facebook, label: 'Facebook', color: '#1877F2' },
                  { icon: Instagram, label: 'Instagram', color: '#E1306C' },
                  { icon: MessageCircle, label: 'WhatsApp', color: '#25D366' },
                ].map(({ icon: Icon, label, color }) => (
                  <a
                    key={label}
                    href="#"
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:shadow-sm"
                    style={{ backgroundColor: `${color}10`, color, border: `1px solid ${color}30`, fontFamily: 'var(--font-heading)' }}
                  >
                    <Icon size={14} /> {label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            {success ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5" style={{ background: 'linear-gradient(135deg, #6B0F0F, #D4AF37)' }}>
                  <Check size={36} className="text-white" />
                </div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '24px', color: '#111', marginBottom: '10px' }}>Message Sent!</h3>
                <p style={{ color: '#6B7280', fontSize: '15px', marginBottom: '24px' }}>We'll reply within 24 hours. Thank you for reaching out!</p>
                <button
                  onClick={() => { setSuccess(false); setForm({ name: '', phone: '', email: '', subject: '', message: '' }); }}
                  className="px-6 py-3 rounded-full text-white font-semibold"
                  style={{ background: 'linear-gradient(135deg, #6B0F0F, #4A0A0A)', fontFamily: 'var(--font-heading)' }}
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { field: 'name', label: 'Full Name', placeholder: 'Your name', type: 'text' },
                    { field: 'phone', label: 'Phone', placeholder: '+880 1XXXXXXXXX', type: 'tel' },
                    { field: 'email', label: 'Email', placeholder: 'your@email.com', type: 'email' },
                    { field: 'subject', label: 'Subject', placeholder: 'How can we help?', type: 'text' },
                  ].map(({ field, label, placeholder, type }) => (
                    <div key={field}>
                      <label style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '13px', color: '#374151', display: 'block', marginBottom: '6px' }}>
                        {label} *
                      </label>
                      <input
                        type={type}
                        required
                        placeholder={placeholder}
                        value={form[field as keyof typeof form]}
                        onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
                        style={inputStyle}
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <label style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '13px', color: '#374151', display: 'block', marginBottom: '6px' }}>
                    Message *
                  </label>
                  <textarea
                    required
                    placeholder="Tell us how we can help you..."
                    value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    rows={6}
                    style={{ ...inputStyle, resize: 'none' }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-xl font-semibold text-white text-base flex items-center justify-center gap-2 transition-all hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-70"
                  style={{ background: 'linear-gradient(135deg, #6B0F0F, #4A0A0A)', fontFamily: 'var(--font-heading)' }}
                >
                  {loading ? 'Sending...' : (<><Send size={18} /> Send Message</>)}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Map */}
      <section id="map" className="px-4 sm:px-6 lg:px-8 pb-14">
        <div className="max-w-6xl mx-auto rounded-3xl overflow-hidden shadow-xl" style={{ height: '400px' }}>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3687.0!2d90.3637!3d22.7010!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3754b2f2e11d2b7b%3A0x0!2sM9W9%2BR6%2C+Barishal%2C+Bangladesh!5e0!3m2!1sen!2sbd!4v1680000000000!5m2!1sen!2sbd"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            title="Rizqara Restaurant Location"
          />
        </div>
      </section>
    </div>
  );
}