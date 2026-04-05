import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  LayoutDashboard, ShoppingBag, Calendar, MessageSquare, Image, UtensilsCrossed,
  LogOut, Eye, Check, X, Trash2, Plus, Star, Users, DollarSign, ChevronRight,
  AlertCircle, Edit2, Save, Package, ExternalLink, Phone, Mail, MapPin,
  Clock, ChevronDown, ChevronUp, Menu as MenuIcon, PlaySquare, Layers,
  TrendingUp, Wallet, Smartphone, Banknote, UploadCloud, Loader2,
  Send, LayoutGrid, CreditCard, CheckCircle2, XCircle, RefreshCw
} from 'lucide-react';
import { useApp, OrderStatus, CarouselSlide, Order, CartItem } from '../context/AppContext';
import { MenuItem } from '../data/restaurantData';
import { TableManagement } from '../components/admin/TableManagement';
import { API_BASE } from '../context/AppContext';

const ADMIN_USER = 'admin@rizqara.com';
const ADMIN_PASS = 'rizqara878';

type AdminTab = 'dashboard' | 'orders' | 'reservations' | 'catering' | 'menu' | 'gallery' | 'messages' | 'tables' | 'payments';

// ─── Input Style Helper ────────────────────────────────────────────────────
const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 14px',
  borderRadius: '10px',
  border: '1.5px solid rgba(107,15,15,0.18)',
  fontSize: '13px',
  fontFamily: 'var(--font-body)',
  outline: 'none',
  color: '#111',
  backgroundColor: '#fff',
};

const labelStyle: React.CSSProperties = {
  fontFamily: 'var(--font-heading)',
  fontSize: '12px',
  fontWeight: 600,
  color: '#374151',
  display: 'block',
  marginBottom: '5px',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
};

// ─── Status Badge Helper ───────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; color: string }> = {
    Pending:           { bg: '#FEF3C7', color: '#92400E' },
    Confirmed:         { bg: '#D1FAE5', color: '#065F46' },
    Preparing:         { bg: '#DBEAFE', color: '#1E40AF' },
    'Out for Delivery':{ bg: '#EDE9FE', color: '#5B21B6' },
    Delivered:         { bg: '#D1FAE5', color: '#065F46' },
    Cancelled:         { bg: '#FEE2E2', color: '#991B1B' },
    Rejected:          { bg: '#FEE2E2', color: '#991B1B' },
  };
  const s = map[status] || { bg: '#F3F4F6', color: '#374151' };
  return (
    <span
      className="px-2.5 py-1 rounded-full text-xs font-semibold"
      style={{ backgroundColor: s.bg, color: s.color, fontFamily: 'var(--font-heading)' }}
    >
      {status}
    </span>
  );
}

// ─── Modal Overlay ─────────────────────────────────────────────────────────
function ModalOverlay({ onClose, children }: { onClose: () => void; children: React.ReactNode }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      {children}
    </div>
  );
}

// ─── Premium Image Uploader ────────────────────────────────────────────────
function PremiumImageUploader({
  value,
  onChange,
  onUploading
}: {
  value: string;
  onChange: (url: string) => void;
  onUploading?: (state: boolean) => void;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploadingLocal, setIsUploadingLocal] = useState(false);

  const handleUpload = async (file: File) => {
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      alert("File size exceeds 10MB limit.");
      return;
    }

    try {
      setIsUploadingLocal(true);
      if (onUploading) onUploading(true);
      const formData = new FormData();
      formData.append('image', file);

      const res = await fetch(`${API_BASE}/upload`, { method: 'POST', body: formData });
      if (!res.ok) throw new Error('Upload failed');

      const data = await res.json();
      onChange(data.url);
    } catch (err) {
      console.error(err);
      alert("Failed to upload image.");
    } finally {
      setIsUploadingLocal(false);
      if (onUploading) onUploading(false);
    }
  };

  return (
    <div>
      <label style={labelStyle}>Premium Image Upload (Max 10MB)</label>
      {!value ? (
        <div
          onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={e => { e.preventDefault(); setIsDragging(false); handleUpload(e.dataTransfer.files[0]); }}
          className={`relative border-2 border-dashed flex flex-col items-center justify-center p-8 rounded-xl transition-all cursor-pointer`}
          style={{
            borderColor: isDragging ? '#6B0F0F' : 'rgba(107,15,15,0.2)',
            backgroundColor: isDragging ? 'rgba(107,15,15,0.02)' : '#FAFAFA'
          }}
        >
          <input
            type="file"
            accept="image/*"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={e => handleUpload(e.target.files?.[0] as File)}
            disabled={isUploadingLocal}
          />
          {isUploadingLocal ? (
            <div className="flex flex-col items-center text-center">
              <Loader2 className="animate-spin mb-3 text-primary-600" size={32} />
              <p style={{ fontFamily: 'var(--font-heading)', fontSize: '14px', fontWeight: 600, color: '#374151' }}>Processing Image...</p>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: '#6B7280' }}>Optimizing for premium display</p>
            </div>
          ) : (
            <div className="flex flex-col items-center text-center pointer-events-none">
              <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mb-3">
                <UploadCloud size={28} style={{ color: '#6B0F0F' }} />
              </div>
              <p style={{ fontFamily: 'var(--font-heading)', fontSize: '14px', fontWeight: 600, color: '#374151' }}>Drag & Drop or Click to Upload</p>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: '#6B7280' }}>JPEG, PNG, WEBP allowed</p>
            </div>
          )}
        </div>
      ) : (
        <div className="relative rounded-xl overflow-hidden shadow-sm group">
          <img src={value} alt="uploaded" className="w-full h-40 object-cover" />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onChange('')}
              className="bg-white text-red-600 font-semibold px-4 py-2 rounded-lg text-sm shadow-md hover:bg-gray-100"
            >
              Remove & Replace
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Menu Item Form (Add / Edit) ───────────────────────────────────────────
interface MenuFormState {
  name: string;
  category: MenuItem['category'];
  price: string;
  description: string;
  spiceLevel: MenuItem['spiceLevel'];
  image: string;
  isVeg: boolean;
  isSpicy: boolean;
  isPopular: boolean;
  prepTime: string;
  serves: string;
}

const blankMenuForm: MenuFormState = {
  name: '', category: 'Biryani', price: '', description: '',
  spiceLevel: 'Medium', image: '', isVeg: false, isSpicy: false,
  isPopular: false, prepTime: '20 min', serves: '1 Person',
};

function menuItemToForm(item: MenuItem): MenuFormState {
  return {
    name: item.name,
    category: item.category,
    price: String(item.price),
    description: item.description,
    spiceLevel: item.spiceLevel,
    image: item.image,
    isVeg: item.isVeg,
    isSpicy: item.isSpicy,
    isPopular: item.isPopular,
    prepTime: item.prepTime,
    serves: item.serves,
  };
}

function MenuItemModal({
  title,
  form,
  setForm,
  onSave,
  onClose,
}: {
  title: string;
  form: MenuFormState;
  setForm: React.Dispatch<React.SetStateAction<MenuFormState>>;
  onSave: () => void;
  onClose: () => void;
}) {
  const categories: MenuItem['category'][] = ['Kebab','Chinese','Thai','Indian','Biryani','Drinks','Dessert'];
  const spiceLevels: MenuItem['spiceLevel'][] = ['Mild','Medium','Hot','Extra Hot'];

  return (
    <ModalOverlay onClose={onClose}>
      <div
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl"
        style={{ backgroundColor: '#fff' }}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: 'rgba(107,15,15,0.12)' }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #6B0F0F, #4A0A0A)' }}>
              <UtensilsCrossed size={16} className="text-white" />
            </div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '18px', color: '#111' }}>{title}</h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors">
            <X size={16} style={{ color: '#6B7280' }} />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-4">
          {/* Premium Image Upload */}
          <PremiumImageUploader
            value={form.image}
            onChange={(url) => setForm((f) => ({ ...f, image: url }))}
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label style={labelStyle}>Item Name *</label>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="e.g. Kacchi Biryani"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Price (৳) *</label>
              <input
                type="number"
                value={form.price}
                onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                placeholder="350"
                style={inputStyle}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label style={labelStyle}>Category</label>
              <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value as MenuItem['category'] }))} style={inputStyle}>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Spice Level</label>
              <select value={form.spiceLevel} onChange={e => setForm(f => ({ ...f, spiceLevel: e.target.value as MenuItem['spiceLevel'] }))} style={inputStyle}>
                {spiceLevels.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label style={labelStyle}>Prep Time</label>
              <input type="text" value={form.prepTime} onChange={e => setForm(f => ({ ...f, prepTime: e.target.value }))} placeholder="25 min" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Serves</label>
              <input type="text" value={form.serves} onChange={e => setForm(f => ({ ...f, serves: e.target.value }))} placeholder="1 Person" style={inputStyle} />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Description</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="Describe the dish..."
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          </div>

          {/* Toggles */}
          <div className="flex gap-4 flex-wrap">
            {([
              { key: 'isVeg', label: 'Vegetarian', color: '#16A34A' },
              { key: 'isSpicy', label: 'Spicy', color: '#DC2626' },
              { key: 'isPopular', label: 'Popular', color: '#D4AF37' },
            ] as const).map(({ key, label, color }) => (
              <label key={key} className="flex items-center gap-2 cursor-pointer select-none">
                <div
                  className="w-10 h-5 rounded-full relative transition-all"
                  style={{ backgroundColor: form[key] ? color : '#D1D5DB' }}
                  onClick={() => setForm(f => ({ ...f, [key]: !f[key] }))}
                >
                  <div
                    className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all"
                    style={{ left: form[key] ? '22px' : '2px' }}
                  />
                </div>
                <span style={{ fontSize: '13px', fontFamily: 'var(--font-heading)', fontWeight: 600, color: form[key] ? color : '#6B7280' }}>
                  {label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t" style={{ borderColor: 'rgba(107,15,15,0.08)' }}>
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all hover:bg-gray-100"
            style={{ border: '1.5px solid rgba(107,15,15,0.15)', color: '#374151', fontFamily: 'var(--font-heading)' }}
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="flex-1 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:shadow-lg hover:-translate-y-0.5"
            style={{ background: 'linear-gradient(135deg, #6B0F0F, #4A0A0A)', fontFamily: 'var(--font-heading)' }}
          >
            <Save size={14} className="inline mr-2" />
            Save Item
          </button>
        </div>
      </div>
    </ModalOverlay>
  );
}

// ─── Gallery Image Edit Modal ──────────────────────────────────────────────
interface GalleryForm {
  url: string;
  title: string;
  category: 'Restaurant' | 'Food' | 'Events' | 'Kitchen';
}

function GalleryEditModal({
  form,
  setForm,
  onSave,
  onClose,
  title,
}: {
  form: GalleryForm;
  setForm: React.Dispatch<React.SetStateAction<GalleryForm>>;
  onSave: () => void;
  onClose: () => void;
  title: string;
}) {
  return (
    <ModalOverlay onClose={onClose}>
      <div className="w-full max-w-lg rounded-2xl shadow-2xl" style={{ backgroundColor: '#fff' }}>
        <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: 'rgba(107,15,15,0.12)' }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #6B0F0F, #4A0A0A)' }}>
              <Image size={16} className="text-white" />
            </div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '18px', color: '#111' }}>{title}</h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors">
            <X size={16} style={{ color: '#6B7280' }} />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <PremiumImageUploader
            value={form.url}
            onChange={(url) => setForm((f) => ({ ...f, url: url }))}
          />
          <div>
            <label style={labelStyle}>Title *</label>
            <input type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Image title" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Category</label>
            <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value as GalleryForm['category'] }))} style={inputStyle}>
              {['Restaurant','Food','Events','Kitchen'].map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div className="flex gap-3 p-6 border-t" style={{ borderColor: 'rgba(107,15,15,0.08)' }}>
          <button onClick={onClose} className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all hover:bg-gray-100" style={{ border: '1.5px solid rgba(107,15,15,0.15)', color: '#374151', fontFamily: 'var(--font-heading)' }}>
            Cancel
          </button>
          <button onClick={onSave} className="flex-1 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:shadow-lg hover:-translate-y-0.5" style={{ background: 'linear-gradient(135deg, #6B0F0F, #4A0A0A)', fontFamily: 'var(--font-heading)' }}>
            <Save size={14} className="inline mr-2" />
            Save Image
          </button>
        </div>
      </div>
    </ModalOverlay>
  );
}

// ─── Carousel Slide Modal ──────────────────────────────────────────────────
interface CarouselForm {
  url: string;
  title: string;
  subtitle: string;
  description: string;
  badge: string;
}

function CarouselSlideModal({
  form,
  setForm,
  onSave,
  onClose,
  title,
}: {
  form: CarouselForm;
  setForm: React.Dispatch<React.SetStateAction<CarouselForm>>;
  onSave: () => void;
  onClose: () => void;
  title: string;
}) {
  return (
    <ModalOverlay onClose={onClose}>
      <div className="w-full max-w-lg rounded-2xl shadow-2xl" style={{ backgroundColor: '#fff' }}>
        <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: 'rgba(107,15,15,0.12)' }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #D4AF37, #B8960C)' }}>
              <PlaySquare size={16} style={{ color: '#111' }} />
            </div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '18px', color: '#111' }}>{title}</h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors">
            <X size={16} style={{ color: '#6B7280' }} />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <PremiumImageUploader
            value={form.url}
            onChange={(url) => setForm((f) => ({ ...f, url: url }))}
          />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label style={labelStyle}>Title *</label>
              <input type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="RIZQARA" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Subtitle</label>
              <input type="text" value={form.subtitle} onChange={e => setForm(f => ({ ...f, subtitle: e.target.value }))} placeholder="Premium Dining" style={inputStyle} />
            </div>
          </div>
          <div>
            <label style={labelStyle}>Description</label>
            <textarea rows={2} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Short description..." style={{ ...inputStyle, resize: 'vertical' }} />
          </div>
          <div>
            <label style={labelStyle}>Badge Text</label>
            <input type="text" value={form.badge} onChange={e => setForm(f => ({ ...f, badge: e.target.value }))} placeholder="★ Best Restaurant" style={inputStyle} />
          </div>
        </div>
        <div className="flex gap-3 p-6 border-t" style={{ borderColor: 'rgba(107,15,15,0.08)' }}>
          <button onClick={onClose} className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all hover:bg-gray-100" style={{ border: '1.5px solid rgba(107,15,15,0.15)', color: '#374151', fontFamily: 'var(--font-heading)' }}>
            Cancel
          </button>
          <button onClick={onSave} className="flex-1 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:shadow-lg hover:-translate-y-0.5" style={{ background: 'linear-gradient(135deg, #D4AF37, #B8960C)', color: '#111', fontFamily: 'var(--font-heading)' }}>
            <Save size={14} className="inline mr-2" />
            Save Slide
          </button>
        </div>
      </div>
    </ModalOverlay>
  );
}

function ReplyModal({ msgId, msgName, onSend, onClose }: { msgId: string; msgName: string; onSend: (id: string, reply: string) => void; onClose: () => void }) {
  const [replyText, setReplyText] = useState('');
  return (
    <ModalOverlay onClose={onClose}>
      <div className="w-full max-w-md rounded-2xl shadow-2xl" style={{ backgroundColor: '#fff' }}>
        <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: 'rgba(107,15,15,0.12)' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '18px', color: '#111' }}>Reply to {msgName}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100"><X size={16} style={{ color: '#6B7280' }} /></button>
        </div>
        <div className="p-6">
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#6B0F0F', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Your Reply</label>
          <textarea
            rows={5}
            value={replyText}
            onChange={e => setReplyText(e.target.value)}
            placeholder="Type your reply here..."
            style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1.5px solid rgba(107,15,15,0.15)', fontSize: '14px', outline: 'none', transition: 'all 0.2s', resize: 'vertical' }}
          />
        </div>
        <div className="flex gap-3 p-6 border-t" style={{ borderColor: 'rgba(107,15,15,0.08)' }}>
          <button onClick={onClose} className="flex-1 py-3 rounded-xl text-sm font-semibold hover:bg-gray-100 transition-all" style={{ border: '1.5px solid rgba(107,15,15,0.15)', color: '#374151', fontFamily: 'var(--font-heading)' }}>Cancel</button>
          <button
            onClick={() => { if (replyText.trim()) { onSend(msgId, replyText.trim()); onClose(); } }}
            className="flex-1 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:shadow-lg"
            style={{ background: 'linear-gradient(135deg, #6B0F0F, #4A0A0A)', fontFamily: 'var(--font-heading)' }}
          >
            <Send size={14} className="inline mr-2" /> Send Reply
          </button>
        </div>
      </div>
    </ModalOverlay>
  );
}

// ─── Order Details Modal ───────────────────────────────────────────────────
function OrderDetailsModal({ order, onClose }: { order: Order; onClose: () => void }) {
  return (
    <ModalOverlay onClose={onClose}>
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b flex items-center justify-between" style={{ borderColor: 'rgba(107,15,15,0.08)' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-red-50">
              <ShoppingBag size={20} style={{ color: '#6B0F0F' }} />
            </div>
            <div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '18px', color: '#111' }}>Order #{order.orderNumber}</h2>
              <p style={{ fontSize: '12px', color: '#6B7280' }}>Placed on {new Date(order.createdAt).toLocaleString()}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors">
            <X size={18} style={{ color: '#6B7280' }} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Customer Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3" style={{ fontFamily: 'var(--font-heading)' }}>Customer Details</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <Users size={14} className="text-gray-400" /> {order.customerName}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone size={14} className="text-gray-400" /> {order.phone}
                </div>
                <div className="flex items-start gap-2 text-sm text-gray-600">
                  <MapPin size={14} className="text-gray-400 mt-0.5" /> {order.address}
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3" style={{ fontFamily: 'var(--font-heading)' }}>Order Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Payment:</span>
                  <span className="font-semibold text-gray-700">{order.paymentMethod}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Status:</span>
                  <StatusBadge status={order.status} />
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Total Amount:</span>
                  <span className="font-bold text-red-700">৳{order.total}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t pt-6" style={{ borderColor: 'rgba(107,15,15,0.05)' }}>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4" style={{ fontFamily: 'var(--font-heading)' }}>Ordered Items</h3>
            <div className="space-y-3">
              {order.items.map((cartItem: CartItem, idx: number) => (
                <div key={idx} className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-white">
                    <img src={cartItem.item.image} alt={cartItem.item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <p className="font-bold text-gray-800" style={{ fontSize: '14px' }}>{cartItem.item.name}</p>
                      <p className="font-bold text-gray-900" style={{ fontSize: '14px' }}>৳{cartItem.item.price * cartItem.quantity}</p>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
                      <span>৳{cartItem.item.price} × {cartItem.quantity}</span>
                    </div>
                    {cartItem.specialRequest && (
                      <div className="mt-2 text-xs bg-amber-50 text-amber-700 p-2 rounded-lg border border-amber-100 italic">
                        " {cartItem.specialRequest} "
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 bg-gray-50 border-t flex justify-end">
          <button
            onClick={onClose}
            className="px-8 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 shadow-lg"
            style={{ background: 'linear-gradient(135deg, #6B0F0F, #4A0A0A)', fontFamily: 'var(--font-heading)' }}
          >
            Close
          </button>
        </div>
      </div>
    </ModalOverlay>
  );
}

// ─── Main Admin Component ──────────────────────────────────────────────────
export function Admin() {
  const navigate = useNavigate();
  const { state, dispatch, showNotification } = useApp();

  // Login
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');

  // Tab
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Modals
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [editingMenuItem, setEditingMenuItem] = useState<MenuItem | null>(null);
  const [menuForm, setMenuForm] = useState<MenuFormState>(blankMenuForm);

  const [showAddGallery, setShowAddGallery] = useState(false);
  const [editingGallery, setEditingGallery] = useState<{ id: string } & GalleryForm | null>(null);
  const [galleryForm, setGalleryForm] = useState<GalleryForm>({ url: '', title: '', category: 'Food' });

  const [showAddCarousel, setShowAddCarousel] = useState(false);
  const [editingCarousel, setEditingCarousel] = useState<CarouselSlide | null>(null);
  const [carouselForm, setCarouselForm] = useState<CarouselForm>({ url: '', title: '', subtitle: '', description: '', badge: '' });

  const [replyingTo, setReplyingTo] = useState<{ id: string; name: string } | null>(null);
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);

  // Gallery sub-tab
  const [gallerySubTab, setGallerySubTab] = useState<'gallery' | 'carousel'>('gallery');


  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginForm.username === ADMIN_USER && loginForm.password === ADMIN_PASS) {
      dispatch({ type: 'ADMIN_LOGIN' });
      setLoginError('');
    } else {
      setLoginError('Invalid credentials. Please try again.');
    }
  };

  const paidTableOrders = (state.tableOrders ?? []).filter(o => o.status === 'Paid');
  const allPaidOrders = [
    ...state.orders.map(o => ({ ...o, type: 'Online' })),
    ...paidTableOrders.map(o => ({ ...o, type: 'Table', createdAt: new Date(o.createdAt).toISOString() }))
  ];

  const onlineRevenue = state.orders.reduce((sum, o) => sum + o.total, 0);
  const tableRevenue  = paidTableOrders.reduce((sum, o) => sum + o.total, 0);
  const totalRevenue  = onlineRevenue + tableRevenue;

  const pendingOrders = state.orders.filter(o => o.status === 'Pending').length;
  const pendingReservations = state.reservations.filter(r => r.status === 'Pending').length;
  const unreadMessages = state.messages.filter(m => !m.isRead).length;
  const pendingCatering = state.cateringRequests.filter(c => c.status === 'Pending').length;
  const pendingTableOrders = (state.tableOrders ?? []).filter(o => o.status === 'Pending').length;

  // ── Payment Analytics ─────────────────────────────────────────────────
  const now = new Date();
  const startOfToday   = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const dayOfWeek      = now.getDay() === 0 ? 6 : now.getDay() - 1; // 0=Mon
  const startOfWeek    = startOfToday - dayOfWeek * 86400000;
  const startOfMonth   = new Date(now.getFullYear(), now.getMonth(), 1).getTime();

  const getRevenueForRange = (start: number) => {
    const online = state.orders.filter(o => new Date(o.createdAt).getTime() >= start).reduce((s, o) => s + o.total, 0);
    const table  = paidTableOrders.filter(o => o.createdAt >= start).reduce((s, o) => s + o.total, 0);
    return online + table;
  };

  const todayRevenue   = getRevenueForRange(startOfToday);
  const weeklyRevenue  = getRevenueForRange(startOfWeek);
  const monthlyRevenue = getRevenueForRange(startOfMonth);

  const bkashOrders  = state.orders.filter(o => o.paymentMethod === 'bKash');
  const nagadOrders  = state.orders.filter(o => o.paymentMethod === 'Nagad');
  const codOrders    = state.orders.filter(o => o.paymentMethod === 'Cash on Delivery');

  const bkashTotal   = bkashOrders.reduce((s, o) => s + o.total, 0);
  const nagadTotal   = nagadOrders.reduce((s, o) => s + o.total, 0);
  const codTotal     = codOrders.reduce((s, o) => s + o.total, 0);
  const tableTotal   = tableRevenue;

  const weekDays = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const weeklyBreakdown = weekDays.map((day, i) => {
    const dayStart = startOfWeek + i * 86400000;
    const dayEnd   = dayStart + 86400000;
    const online = state.orders.filter(o => { const t = new Date(o.createdAt).getTime(); return t >= dayStart && t < dayEnd; }).reduce((s, o) => s + o.total, 0);
    const table  = paidTableOrders.filter(o => { return o.createdAt >= dayStart && o.createdAt < dayEnd; }).reduce((s, o) => s + o.total, 0);
    return { day, rev: online + table };
  });
  const maxDayRev = Math.max(...weeklyBreakdown.map(d => d.rev), 1);

  const sidebarItems: { id: AdminTab; icon: typeof LayoutDashboard; label: string; badge?: number }[] = [
    { id: 'dashboard',    icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'orders',       icon: ShoppingBag,     label: 'Orders',           badge: pendingOrders },
    { id: 'reservations', icon: Calendar,         label: 'Reservations',     badge: pendingReservations },
    { id: 'catering',     icon: Package,          label: 'Catering',         badge: pendingCatering },
    { id: 'tables',       icon: LayoutGrid,       label: 'Table Management', badge: pendingTableOrders },
    { id: 'payments',     icon: CreditCard,       label: 'Payments' },
    { id: 'menu',         icon: UtensilsCrossed,  label: 'Menu Management' },
    { id: 'gallery',      icon: Image,            label: 'Gallery' },
    { id: 'messages',     icon: MessageSquare,    label: 'Messages',         badge: unreadMessages },
  ];

  // ── Save Menu Item ──────────────────────────────────────────────────
  const handleSaveMenuItem = () => {
    if (!menuForm.name || !menuForm.price) {
      showNotification('Name and price are required.', 'error');
      return;
    }
    const slug = menuForm.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const payload: MenuItem = {
      id: editingMenuItem?.id || Date.now().toString(),
      slug: editingMenuItem?.slug || slug,
      name: menuForm.name,
      category: menuForm.category,
      price: Number(menuForm.price),
      description: menuForm.description,
      spiceLevel: menuForm.spiceLevel,
      image: menuForm.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80',
      isVeg: menuForm.isVeg,
      isSpicy: menuForm.isSpicy,
      isPopular: menuForm.isPopular,
      prepTime: menuForm.prepTime,
      serves: menuForm.serves,
      rating: editingMenuItem?.rating || 4.5,
      reviewCount: editingMenuItem?.reviewCount || 0,
      ingredients: editingMenuItem?.ingredients || [],
      nutrition: editingMenuItem?.nutrition || { calories: 0, protein: '0g', carbs: '0g', fat: '0g' },
    };
    if (editingMenuItem) {
      dispatch({ type: 'UPDATE_MENU_ITEM', payload });
      showNotification(`${menuForm.name} updated!`, 'success');
      setEditingMenuItem(null);
    } else {
      dispatch({ type: 'ADD_MENU_ITEM', payload });
      showNotification(`${menuForm.name} added to menu!`, 'success');
      setShowAddMenu(false);
    }
    setMenuForm(blankMenuForm);
  };

  // ── Save Gallery Image ──────────────────────────────────────────────
  const handleSaveGallery = () => {
    if (!galleryForm.url || !galleryForm.title) {
      showNotification('URL and title are required.', 'error');
      return;
    }
    if (editingGallery) {
      dispatch({ type: 'UPDATE_GALLERY_IMAGE', payload: { id: editingGallery.id, ...galleryForm } });
      showNotification('Gallery image updated!', 'success');
      setEditingGallery(null);
    } else {
      dispatch({ type: 'ADD_GALLERY_IMAGE', payload: { id: Date.now().toString(), ...galleryForm } });
      showNotification('Image added to gallery!', 'success');
      setShowAddGallery(false);
    }
    setGalleryForm({ url: '', title: '', category: 'Food' });
  };

  // ── Save Carousel Slide ─────────────────────────────────────────────
  const handleSaveCarousel = () => {
    if (!carouselForm.url || !carouselForm.title) {
      showNotification('URL and title are required.', 'error');
      return;
    }
    if (editingCarousel) {
      dispatch({ type: 'UPDATE_CAROUSEL_SLIDE', payload: { id: editingCarousel.id, ...carouselForm } });
      showNotification('Carousel slide updated!', 'success');
      setEditingCarousel(null);
    } else {
      dispatch({ type: 'ADD_CAROUSEL_SLIDE', payload: { id: Date.now().toString(), ...carouselForm } });
      showNotification('Carousel slide added!', 'success');
      setShowAddCarousel(false);
    }
    setCarouselForm({ url: '', title: '', subtitle: '', description: '', badge: '' });
  };

  // ──────────────────────────────────────────────────────────────────────
  // LOGIN SCREEN
  // ──────────────────────────────────────────────────────────────────────
  if (!state.isAdminLoggedIn) {
    return (
      <div
        className="min-h-screen flex items-center justify-center relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1A0000 0%, #2D0000 40%, #4A0A0A 70%, #6B0F0F 100%)' }}
      >
        {/* Decorative background */}
        <div className="absolute inset-0 pointer-events-none">
          <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(212,175,55,0.08) 0%, transparent 70%)' }} />
          <div style={{ position: 'absolute', bottom: '-20%', left: '-10%', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(107,15,15,0.4) 0%, transparent 70%)' }} />
        </div>

        <div className="w-full max-w-md px-4 relative">
          {/* Logo Branding */}
          <div className="text-center mb-8">
            <div className="inline-block mb-3">
              <h2 style={{ color: '#ffffff', fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '24px', letterSpacing: '2px', lineHeight: 1 }}>
                RIZQARA
              </h2>
              <p style={{ color: '#D4AF37', fontSize: '10px', letterSpacing: '4px', fontWeight: 500, textAlign: 'center' }}>
                RESTAURANT
              </p>
            </div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '20px', color: 'rgba(255,255,255,0.9)', letterSpacing: '-0.5px' }}>Admin Dashboard</h1>
          </div>

          <form
            onSubmit={handleLogin}
            className="p-8 rounded-2xl"
            style={{ background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            {loginError && (
              <div className="flex items-center gap-2 mb-5 p-3.5 rounded-xl" style={{ backgroundColor: 'rgba(220,38,38,0.15)', border: '1px solid rgba(220,38,38,0.3)' }}>
                <AlertCircle size={16} style={{ color: '#FCA5A5', flexShrink: 0 }} />
                <span style={{ color: '#FCA5A5', fontSize: '13px' }}>{loginError}</span>
              </div>
            )}
            <div className="space-y-4">
              {[
                { field: 'username', label: 'Email Address', type: 'text', placeholder: 'admin@rizqara.com' },
                { field: 'password', label: 'Security Password', type: 'password', placeholder: '••••••••' },
              ].map(({ field, label, type, placeholder }) => (
                <div key={field}>
                  <label style={{ color: 'rgba(255,255,255,0.75)', fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '6px', fontFamily: 'var(--font-heading)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {label}
                  </label>
                  <input
                    type={type}
                    required
                    placeholder={placeholder}
                    value={loginForm[field as keyof typeof loginForm]}
                    onChange={e => setLoginForm(f => ({ ...f, [field]: e.target.value }))}
                    style={{
                      width: '100%', padding: '13px 16px', borderRadius: '12px',
                      background: 'rgba(255,255,255,0.09)', border: '1px solid rgba(255,255,255,0.15)',
                      color: 'white', fontSize: '14px', outline: 'none', fontFamily: 'var(--font-body)',
                    }}
                  />
                </div>
              ))}
            </div>
            <button
              type="submit"
              className="w-full mt-6 py-4 rounded-xl font-semibold transition-all hover:shadow-2xl hover:-translate-y-0.5 active:translate-y-0"
              style={{ background: 'linear-gradient(135deg, #D4AF37, #B8960C)', color: '#1A0000', fontFamily: 'var(--font-heading)', fontSize: '15px', fontWeight: 800 }}
            >
              Sign In to System
            </button>
          </form>

          <p className="text-center mt-6">
            <button
              onClick={() => navigate('/')}
              className="text-sm transition-all hover:underline"
              style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-body)' }}
            >
              ← Back to Website
            </button>
          </p>
        </div>
      </div>
    );
  }

  // ──────────────────────────────────────────────────────────────────────
  // MAIN ADMIN LAYOUT (standalone — no Navbar/Footer)
  // ──────────────────────────────────────────────────────────────────────
  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#F0EDE8' }}>

      {/* ── Mobile Overlay ────────────────────────────────── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 md:hidden"
          style={{ backgroundColor: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(2px)' }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ──────────────────────────────────────── */}
      <div
        className={`flex-shrink-0 flex flex-col shadow-2xl fixed top-0 bottom-0 left-0 z-40 transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
        style={{
          width: '260px',
          background: 'linear-gradient(180deg, #1A0000 0%, #2D0000 30%, #4A0A0A 100%)',
        }}
      >
        {/* Sidebar Header */}
        <div className="px-5 py-6 border-b" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div>
                <p style={{ color: '#fff', fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '15px', lineHeight: 1 }}>Rizqara</p>
                <p style={{ color: '#D4AF37', fontSize: '10px', fontFamily: 'var(--font-heading)', fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase' }}>Admin Panel</p>
              </div>
            </div>
            {/* Close button — mobile only */}
            <button
              className="md:hidden w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(255,255,255,0.1)' }}
              onClick={() => setSidebarOpen(false)}
            >
              <X size={16} style={{ color: 'rgba(255,255,255,0.7)' }} />
            </button>
          </div>
          <div className="px-3 py-2.5 rounded-xl" style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.15)' }}>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '10px', letterSpacing: '1.5px', textTransform: 'uppercase', fontFamily: 'var(--font-heading)', marginBottom: '2px' }}>Logged in as</p>
            <p style={{ color: '#D4AF37', fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '13px' }}>Administrator</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 space-y-0.5 overflow-y-auto">
          {sidebarItems.map(({ id, icon: Icon, label, badge }) => (
            <button
              key={id}
              onClick={() => { setActiveTab(id); setSidebarOpen(false); }}
              className="w-full flex items-center justify-between px-3 py-3 rounded-xl text-sm font-medium transition-all"
              style={{
                background: activeTab === id ? 'rgba(212,175,55,0.18)' : 'transparent',
                color: activeTab === id ? '#D4AF37' : 'rgba(255,255,255,0.6)',
                border: activeTab === id ? '1px solid rgba(212,175,55,0.25)' : '1px solid transparent',
                fontFamily: 'var(--font-heading)',
              }}
            >
              <div className="flex items-center gap-3">
                <Icon size={16} />
                <span>{label}</span>
              </div>
              {badge !== undefined && badge > 0 && (
                <span
                  className="px-1.5 py-0.5 rounded-full text-xs font-bold text-white"
                  style={{ backgroundColor: '#DC2626', minWidth: '20px', textAlign: 'center' }}
                >
                  {badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t space-y-1" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-all hover:bg-white/8"
            style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-heading)' }}
          >
            <ExternalLink size={14} />
            <span>View Website</span>
          </button>
          <button
            onClick={() => dispatch({ type: 'ADMIN_LOGOUT' })}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-all hover:bg-red-900/20"
            style={{ color: 'rgba(255,100,100,0.7)', fontFamily: 'var(--font-heading)' }}
          >
            <LogOut size={14} /> Logout
          </button>
        </div>
      </div>

      {/* ── Main Content ─────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-h-screen w-full md:ml-[260px]">

        {/* Top Bar */}
        <div
          className="flex items-center justify-between px-4 md:px-6 py-4 sticky top-0 z-30 shadow-sm"
          style={{ backgroundColor: '#fff', borderBottom: '1px solid rgba(107,15,15,0.08)' }}
        >
          <div className="flex items-center gap-3 min-w-0">
            {/* Hamburger — mobile only */}
            <button
              className="md:hidden flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all"
              style={{ backgroundColor: '#FDF8F0', border: '1px solid rgba(107,15,15,0.12)' }}
              onClick={() => setSidebarOpen(true)}
            >
              <MenuIcon size={18} style={{ color: '#6B0F0F' }} />
            </button>
            <div className="min-w-0">
              <h2 className="truncate" style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '18px', color: '#111', lineHeight: 1 }}>
                {sidebarItems.find(s => s.id === activeTab)?.label}
              </h2>
              <p className="hidden sm:block" style={{ fontSize: '11px', color: '#9CA3AF', fontFamily: 'var(--font-body)', marginTop: '2px' }}>
                {new Date().toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {unreadMessages > 0 && (
              <div className="relative">
                <button onClick={() => { setActiveTab('messages'); setSidebarOpen(false); }} className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#FEE2E2' }}>
                  <MessageSquare size={16} style={{ color: '#DC2626' }} />
                </button>
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-white flex items-center justify-center" style={{ backgroundColor: '#DC2626', fontSize: '9px' }}>{unreadMessages}</span>
              </div>
            )}
            {pendingTableOrders > 0 && (
              <div className="relative">
                <button onClick={() => { setActiveTab('tables'); setSidebarOpen(false); }} className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#EDE9FE' }}>
                  <LayoutGrid size={16} style={{ color: '#7C3AED' }} />
                </button>
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-white flex items-center justify-center" style={{ backgroundColor: '#7C3AED', fontSize: '9px' }}>{pendingTableOrders}</span>
              </div>
            )}
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold shadow"
              style={{ background: 'linear-gradient(135deg, #6B0F0F, #D4AF37)', fontFamily: 'var(--font-heading)', fontSize: '14px' }}
            >
              A
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 p-4 md:p-6 overflow-auto">

          {/* ══ DASHBOARD ══════════════════════════════════ */}
          {activeTab === 'dashboard' && (
            <div>
              {/* Stats Cards — Row 1 */}
              <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
                {[
                  { label: 'Total Revenue', value: `৳${totalRevenue.toLocaleString()}`, icon: DollarSign, color: '#16A34A', bg: '#DCFCE7', sub: 'Online + Table Service' },
                  { label: 'Active Orders', value: pendingOrders + pendingTableOrders, icon: UtensilsCrossed, color: '#6B0F0F', bg: '#FEE2E2', sub: `${pendingOrders} Online, ${pendingTableOrders} Table` },
                  { label: 'Reservations', value: state.reservations.length, icon: Calendar, color: '#2563EB', bg: '#DBEAFE', sub: `${pendingReservations} pending` },
                  { label: 'Messages', value: state.messages.length, icon: MessageSquare, color: '#7C3AED', bg: '#EDE9FE', sub: `${unreadMessages} unread` },
                ].map(({ label, value, icon: Icon, color, bg, sub }) => (
                  <div key={label} className="bg-white p-5 rounded-2xl shadow-sm" style={{ border: '1px solid rgba(0,0,0,0.04)' }}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: bg }}>
                        <Icon size={20} style={{ color }} />
                      </div>
                    </div>
                    <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '26px', color, lineHeight: 1 }}>{value}</p>
                    <p style={{ fontSize: '12px', color: '#6B7280', fontFamily: 'var(--font-heading)', fontWeight: 600, marginTop: '4px' }}>{label}</p>
                    <p style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '2px' }}>{sub}</p>
                  </div>
                ))}
              </div>

              {/* Stats Cards — Row 2 */}
              <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
                {[
                  { label: 'Catering Requests', value: state.cateringRequests.length, icon: Package, color: '#EA580C', bg: '#FEF3C7', sub: `${pendingCatering} pending` },
                  { label: 'Menu Items', value: state.menuItems.length, icon: UtensilsCrossed, color: '#0891B2', bg: '#CFFAFE', sub: 'Active items' },
                  { label: 'Gallery Images', value: state.galleryImages.length, icon: Image, color: '#7C3AED', bg: '#EDE9FE', sub: `${state.carouselSlides.length} carousel slides` },
                  { label: 'Customers', value: state.orders.length + state.reservations.length, icon: Users, color: '#16A34A', bg: '#DCFCE7', sub: 'Total interactions' },
                ].map(({ label, value, icon: Icon, color, bg, sub }) => (
                  <div key={label} className="bg-white p-5 rounded-2xl shadow-sm" style={{ border: '1px solid rgba(0,0,0,0.04)' }}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: bg }}>
                        <Icon size={20} style={{ color }} />
                      </div>
                    </div>
                    <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '26px', color, lineHeight: 1 }}>{value}</p>
                    <p style={{ fontSize: '12px', color: '#6B7280', fontFamily: 'var(--font-heading)', fontWeight: 600, marginTop: '4px' }}>{label}</p>
                    <p style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '2px' }}>{sub}</p>
                  </div>
                ))}
              </div>

              {/* Recent Activity */}
              <div className="grid lg:grid-cols-2 gap-5">
                {/* Recent Orders */}
                <div className="bg-white rounded-2xl shadow-sm" style={{ border: '1px solid rgba(0,0,0,0.04)' }}>
                  <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: 'rgba(0,0,0,0.05)' }}>
                    <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '15px', color: '#111' }}>Recent Orders</h3>
                    <button onClick={() => setActiveTab('orders')} style={{ fontSize: '12px', color: '#6B0F0F', fontFamily: 'var(--font-heading)', fontWeight: 700 }}>
                      View All <ChevronRight size={13} className="inline" />
                    </button>
                  </div>
                  <div>
                    {state.orders.slice(0, 5).map(order => (
                      <div key={order.id!} className="px-5 py-3.5 flex items-center justify-between border-b last:border-0" style={{ borderColor: 'rgba(0,0,0,0.04)' }}>
                        <div>
                          <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '13px', color: '#6B0F0F' }}>#{order.orderNumber}</p>
                          <p style={{ fontSize: '12px', color: '#6B7280' }}>{order.customerName} • {order.items.length} item{order.items.length !== 1 ? 's' : ''}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span style={{ fontWeight: 700, fontSize: '13px', color: '#111', fontFamily: 'var(--font-heading)' }}>৳{order.total}</span>
                          <StatusBadge status={order.status} />
                        </div>
                      </div>
                    ))}
                    {state.orders.length === 0 && <p className="py-10 text-center" style={{ color: '#9CA3AF', fontSize: '14px' }}>No orders yet</p>}
                  </div>
                </div>

                {/* Recent Reservations */}
                <div className="bg-white rounded-2xl shadow-sm" style={{ border: '1px solid rgba(0,0,0,0.04)' }}>
                  <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: 'rgba(0,0,0,0.05)' }}>
                    <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '15px', color: '#111' }}>Recent Reservations</h3>
                    <button onClick={() => setActiveTab('reservations')} style={{ fontSize: '12px', color: '#6B0F0F', fontFamily: 'var(--font-heading)', fontWeight: 700 }}>
                      View All <ChevronRight size={13} className="inline" />
                    </button>
                  </div>
                  <div>
                    {state.reservations.slice(0, 5).map(res => (
                      <div key={res.id!} className="px-5 py-3.5 flex items-center justify-between border-b last:border-0" style={{ borderColor: 'rgba(0,0,0,0.04)' }}>
                        <div>
                          <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '13px', color: '#111' }}>{res.name}</p>
                          <p style={{ fontSize: '12px', color: '#6B7280' }}>{res.date} at {res.time} • {res.guests} guests</p>
                        </div>
                        <StatusBadge status={res.status} />
                      </div>
                    ))}
                    {state.reservations.length === 0 && <p className="py-10 text-center" style={{ color: '#9CA3AF', fontSize: '14px' }}>No reservations yet</p>}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ══ ORDERS ═════════════════════════════════════ */}
          {activeTab === 'orders' && (
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden" style={{ border: '1px solid rgba(0,0,0,0.04)' }}>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr style={{ backgroundColor: '#FDF8F0', borderBottom: '1px solid rgba(107,15,15,0.08)' }}>
                      {['Order #', 'Customer', 'Items', 'Total', 'Status', 'Details', 'Update'].map(h => (
                        <th key={h} className="px-4 py-3.5 text-left" style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '11px', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.7px' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {state.orders.map(order => (
                      <tr key={order.id!} className="border-b hover:bg-amber-50/30 transition-colors" style={{ borderColor: 'rgba(0,0,0,0.04)' }}>
                        <td className="px-4 py-3.5">
                          <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '13px', color: '#6B0F0F' }}>#{order.orderNumber}</p>
                          <p style={{ fontSize: '11px', color: '#9CA3AF' }}>{new Date(order.createdAt).toLocaleDateString()}</p>
                        </td>
                        <td className="px-4 py-3.5">
                          <p style={{ fontSize: '13px', fontWeight: 600, color: '#111', fontFamily: 'var(--font-heading)' }}>{order.customerName}</p>
                          <p style={{ fontSize: '11px', color: '#9CA3AF' }}>{order.phone}</p>
                        </td>
                        <td className="px-4 py-3.5">
                          <p style={{ fontSize: '13px', color: '#374151' }}>{order.items.length} item{order.items.length !== 1 ? 's' : ''}</p>
                        </td>
                        <td className="px-4 py-3.5">
                          <p style={{ fontWeight: 800, fontSize: '14px', color: '#6B0F0F', fontFamily: 'var(--font-heading)' }}>৳{order.total}</p>
                        </td>
                        <td className="px-4 py-3.5">
                          <StatusBadge status={order.status} />
                        </td>
                        <td className="px-4 py-3.5">
                            <button 
                                onClick={() => setViewingOrder(order)}
                                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all hover:bg-red-50 text-red-800"
                                style={{ border: '1px solid rgba(107,15,15,0.15)', fontFamily: 'var(--font-heading)' }}
                            >
                                <Eye size={12} /> View Details
                            </button>
                        </td>
                        <td className="px-4 py-3.5">
                          <select
                            value={order.status}
                            onChange={e => {
                              dispatch({ type: 'UPDATE_ORDER_STATUS', payload: { id: order.id!, status: e.target.value as OrderStatus } });
                              showNotification('Order status updated!', 'success');
                            }}
                            className="px-2 py-1.5 rounded-lg border text-xs font-semibold"
                            style={{ borderColor: 'rgba(107,15,15,0.2)', color: '#111', fontFamily: 'var(--font-heading)', cursor: 'pointer' }}
                          >
                            {(['Pending','Preparing','Out for Delivery','Delivered','Cancelled'] as OrderStatus[]).map(s => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {state.orders.length === 0 && (
                  <div className="py-20 text-center">
                    <ShoppingBag size={40} className="mx-auto mb-3" style={{ color: '#D1D5DB' }} />
                    <p style={{ color: '#6B7280', fontSize: '15px' }}>No orders received yet.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ══ RESERVATIONS ═══════════════════════════════ */}
          {activeTab === 'reservations' && (
            <div className="space-y-4">
              {state.reservations.map(res => (
                <div key={res.id!} className="bg-white rounded-2xl p-5 shadow-sm" style={{ border: '1px solid rgba(0,0,0,0.04)' }}>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div>
                        <p style={{ fontSize: '10px', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '1px', fontFamily: 'var(--font-heading)', marginBottom: '3px' }}>Guest Name</p>
                        <p style={{ fontWeight: 700, fontSize: '14px', color: '#111', fontFamily: 'var(--font-heading)' }}>{res.name}</p>
                        <p style={{ fontSize: '11px', color: '#6B7280' }}>{res.email}</p>
                      </div>
                      <div>
                        <p style={{ fontSize: '10px', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '1px', fontFamily: 'var(--font-heading)', marginBottom: '3px' }}>Date & Time</p>
                        <p style={{ fontSize: '13px', color: '#374151', fontWeight: 600 }}>{res.date}</p>
                        <p style={{ fontSize: '12px', color: '#6B7280' }}>{res.time}</p>
                      </div>
                      <div>
                        <p style={{ fontSize: '10px', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '1px', fontFamily: 'var(--font-heading)', marginBottom: '3px' }}>Guests & Phone</p>
                        <p style={{ fontSize: '13px', color: '#374151', fontWeight: 600 }}>{res.guests} Guests</p>
                        <p style={{ fontSize: '12px', color: '#6B7280' }}>{res.phone}</p>
                      </div>
                      <div>
                        <p style={{ fontSize: '10px', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '1px', fontFamily: 'var(--font-heading)', marginBottom: '3px' }}>Status</p>
                        <StatusBadge status={res.status} />
                        {res.specialRequest && <p style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '4px' }} className="line-clamp-1">{res.specialRequest}</p>}
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => { dispatch({ type: 'UPDATE_RESERVATION', payload: { id: res.id!, status: 'Confirmed' } }); showNotification('Reservation confirmed!', 'success'); }}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all hover:shadow-md"
                        style={{ backgroundColor: '#D1FAE5', color: '#065F46', fontFamily: 'var(--font-heading)' }}
                      >
                        <Check size={12} /> Confirm
                      </button>
                      <button
                        onClick={() => { dispatch({ type: 'UPDATE_RESERVATION', payload: { id: res.id!, status: 'Rejected' } }); showNotification('Reservation rejected.', 'info'); }}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all hover:shadow-md"
                        style={{ backgroundColor: '#FEE2E2', color: '#991B1B', fontFamily: 'var(--font-heading)' }}
                      >
                        <X size={12} /> Reject
                      </button>
                      <button
                        onClick={() => { dispatch({ type: 'DELETE_RESERVATION', payload: res.id! }); showNotification('Reservation deleted.', 'info'); }}
                        className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
                      >
                        <Trash2 size={14} style={{ color: '#9CA3AF' }} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {state.reservations.length === 0 && (
                <div className="bg-white rounded-2xl py-20 text-center shadow-sm">
                  <Calendar size={44} className="mx-auto mb-3" style={{ color: '#D1D5DB' }} />
                  <p style={{ color: '#6B7280', fontSize: '15px' }}>No reservations yet.</p>
                </div>
              )}
            </div>
          )}

          {/* ══ CATERING ═══════════════════════════════════ */}
          {activeTab === 'catering' && (
            <div className="space-y-4">
              {/* Header */}
              <div className="bg-white rounded-2xl p-5 shadow-sm" style={{ border: '1px solid rgba(0,0,0,0.04)', background: 'linear-gradient(135deg, #FDF8F0, #fff)' }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #EA580C, #C2410C)' }}>
                    <Package size={18} className="text-white" />
                  </div>
                  <div>
                    <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '16px', color: '#111' }}>Catering Requests</h3>
                    <p style={{ fontSize: '12px', color: '#6B7280' }}>{state.cateringRequests.length} total • {pendingCatering} pending review</p>
                  </div>
                </div>
              </div>

              {state.cateringRequests.map(req => (
                <div key={req.id!} className="bg-white rounded-2xl p-5 shadow-sm" style={{ border: `1px solid ${req.status === 'Pending' ? 'rgba(234,88,12,0.2)' : 'rgba(0,0,0,0.04)'}`, backgroundColor: req.status === 'Pending' ? '#FFFBF5' : 'white' }}>
                  <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold" style={{ background: 'linear-gradient(135deg, #EA580C, #D4AF37)', fontFamily: 'var(--font-heading)' }}>
                            {req.name.charAt(0)}
                          </div>
                          <div>
                            <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '15px', color: '#111' }}>{req.name}</p>
                            <p style={{ fontSize: '12px', color: '#6B7280' }}>{req.email} • {req.phone}</p>
                          </div>
                        </div>
                        <StatusBadge status={req.status} />
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
                        {[
                          { icon: Package, label: 'Event Type', value: req.eventType },
                          { icon: Users, label: 'Guests', value: `${req.guests} people` },
                          { icon: Calendar, label: 'Date', value: req.date },
                          { icon: MapPin, label: 'Location', value: req.location },
                          { icon: Star, label: 'Package', value: req.package },
                          { icon: Clock, label: 'Received', value: new Date(req.createdAt).toLocaleDateString() },
                        ].map(({ icon: Icon, label, value }) => (
                          <div key={label} className="flex items-start gap-2">
                            <Icon size={13} style={{ color: '#EA580C', marginTop: '2px', flexShrink: 0 }} />
                            <div>
                              <p style={{ fontSize: '10px', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.5px', fontFamily: 'var(--font-heading)' }}>{label}</p>
                              <p style={{ fontSize: '13px', color: '#374151', fontWeight: 600 }}>{value}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {req.message && (
                        <p style={{ fontSize: '13px', color: '#6B7280', padding: '10px 14px', borderRadius: '10px', backgroundColor: '#F9F5F0', lineHeight: '1.5' }}>
                          {req.message}
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex lg:flex-col gap-2 lg:w-32 flex-shrink-0">
                      <button
                        onClick={() => { dispatch({ type: 'UPDATE_CATERING', payload: { id: req.id!, status: 'Confirmed' } }); showNotification('Catering request confirmed!', 'success'); }}
                        className="flex-1 lg:flex-none flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all hover:shadow-md"
                        style={{ backgroundColor: '#D1FAE5', color: '#065F46', fontFamily: 'var(--font-heading)' }}
                      >
                        <CheckCircle2 size={13} /> Confirm
                      </button>
                      <button
                        onClick={() => { dispatch({ type: 'UPDATE_CATERING', payload: { id: req.id!, status: 'Rejected' } }); showNotification('Catering request rejected.', 'info'); }}
                        className="flex-1 lg:flex-none flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all hover:shadow-md"
                        style={{ backgroundColor: '#FEE2E2', color: '#991B1B', fontFamily: 'var(--font-heading)' }}
                      >
                        <XCircle size={13} /> Reject
                      </button>
                      <button
                        onClick={() => { dispatch({ type: 'UPDATE_CATERING', payload: { id: req.id!, status: 'Pending' } }); showNotification('Reset to pending.', 'info'); }}
                        className="flex-1 lg:flex-none flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all hover:bg-gray-100"
                        style={{ backgroundColor: '#F3F4F6', color: '#6B7280', fontFamily: 'var(--font-heading)' }}
                      >
                        <RefreshCw size={12} /> Reset
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {state.cateringRequests.length === 0 && (
                <div className="bg-white rounded-2xl py-20 text-center shadow-sm">
                  <Package size={44} className="mx-auto mb-3" style={{ color: '#D1D5DB' }} />
                  <p style={{ color: '#6B7280', fontSize: '15px' }}>No catering requests yet.</p>
                  <p style={{ color: '#9CA3AF', fontSize: '13px', marginTop: '4px' }}>Requests submitted from the Catering page will appear here.</p>
                </div>
              )}
            </div>
          )}

          {/* ══ TABLE MANAGEMENT ════════════════════════════ */}
          {activeTab === 'tables' && <TableManagement />}

          {/* ══ MENU MANAGEMENT ════════════════════════════ */}
          {activeTab === 'menu' && (
            <div>
              {/* Toolbar */}
              <div className="flex items-center justify-between mb-5">
                <p style={{ color: '#6B7280', fontSize: '14px', fontFamily: 'var(--font-body)' }}>
                  <span style={{ fontWeight: 700, color: '#111', fontFamily: 'var(--font-heading)' }}>{state.menuItems.length}</span> menu items
                </p>
                <button
                  onClick={() => { setMenuForm(blankMenuForm); setShowAddMenu(true); }}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:shadow-lg hover:-translate-y-0.5"
                  style={{ background: 'linear-gradient(135deg, #6B0F0F, #4A0A0A)', fontFamily: 'var(--font-heading)' }}
                >
                  <Plus size={15} /> Add New Item
                </button>
              </div>

              {/* Menu Items Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {state.menuItems.map(item => (
                  <div key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-sm group" style={{ border: '1px solid rgba(0,0,0,0.04)' }}>
                    <div className="relative h-44 overflow-hidden">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)' }} />
                      <div className="absolute top-2 left-2 flex gap-1 flex-wrap">
                        {item.isPopular && (
                          <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ backgroundColor: '#D4AF37', color: '#1A0000', fontFamily: 'var(--font-heading)' }}>Popular</span>
                        )}
                        {item.isVeg && (
                          <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ backgroundColor: '#16A34A', color: 'white', fontFamily: 'var(--font-heading)' }}>Veg</span>
                        )}
                      </div>
                      <div className="absolute bottom-2 right-2">
                        <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '16px', color: '#fff', textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>৳{item.price}</span>
                      </div>
                    </div>
                    <div className="p-3.5">
                      <div className="mb-1">
                        <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '13px', color: '#111' }} className="line-clamp-1">{item.name}</h3>
                        <p style={{ fontSize: '11px', color: '#6B7280' }}>{item.category} • {item.spiceLevel}</p>
                      </div>
                      <div className="flex items-center gap-1 mb-3">
                        <Star size={10} fill="#D4AF37" style={{ color: '#D4AF37' }} />
                        <span style={{ fontSize: '11px', color: '#6B7280' }}>{item.rating} ({item.reviewCount})</span>
                      </div>
                      {/* Action Buttons */}
                      <div className="grid grid-cols-3 gap-1.5">
                        <button
                          onClick={() => {
                            setEditingMenuItem(item);
                            setMenuForm(menuItemToForm(item));
                          }}
                          className="flex flex-col items-center gap-1 py-2 rounded-xl text-xs font-semibold transition-all hover:shadow-sm"
                          style={{ backgroundColor: '#DBEAFE', color: '#1E40AF', fontFamily: 'var(--font-heading)' }}
                        >
                          <Edit2 size={11} />
                          <span style={{ fontSize: '10px' }}>Edit</span>
                        </button>
                        <button
                          onClick={() => {
                            dispatch({ type: 'UPDATE_MENU_ITEM', payload: { ...item, isPopular: !item.isPopular } });
                            showNotification(`${item.name} ${item.isPopular ? 'unfeatured' : 'featured'}!`, 'success');
                          }}
                          className="flex flex-col items-center gap-1 py-2 rounded-xl text-xs font-semibold transition-all hover:shadow-sm"
                          style={{ backgroundColor: item.isPopular ? 'rgba(212,175,55,0.2)' : '#F3F4F6', color: item.isPopular ? '#B8960C' : '#6B7280', fontFamily: 'var(--font-heading)' }}
                        >
                          <Star size={11} fill={item.isPopular ? '#D4AF37' : 'none'} style={{ color: item.isPopular ? '#D4AF37' : '#6B7280' }} />
                          <span style={{ fontSize: '10px' }}>{item.isPopular ? 'Unfeature' : 'Feature'}</span>
                        </button>
                        <button
                          onClick={() => {
                            dispatch({ type: 'DELETE_MENU_ITEM', payload: item.id });
                            showNotification(`${item.name} deleted.`, 'info');
                          }}
                          className="flex flex-col items-center gap-1 py-2 rounded-xl text-xs font-semibold transition-all hover:shadow-sm"
                          style={{ backgroundColor: '#FEE2E2', color: '#DC2626', fontFamily: 'var(--font-heading)' }}
                        >
                          <Trash2 size={11} />
                          <span style={{ fontSize: '10px' }}>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {state.menuItems.length === 0 && (
                <div className="bg-white rounded-2xl py-20 text-center shadow-sm mt-4">
                  <UtensilsCrossed size={44} className="mx-auto mb-3" style={{ color: '#D1D5DB' }} />
                  <p style={{ color: '#6B7280', fontSize: '15px' }}>No menu items. Click "Add New Item" to get started.</p>
                </div>
              )}
            </div>
          )}

          {/* ══ GALLERY MANAGEMENT ═════════════════════════ */}
          {activeTab === 'gallery' && (
            <div>
              {/* Sub-Tabs */}
              <div className="flex gap-2 mb-6">
                {([
                  { id: 'gallery', label: 'Gallery Images', icon: Image, count: state.galleryImages.length },
                  { id: 'carousel', label: 'Carousel Slides', icon: Layers, count: state.carouselSlides.length },
                ] as const).map(({ id, label, icon: Icon, count }) => (
                  <button
                    key={id}
                    onClick={() => setGallerySubTab(id)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
                    style={{
                      background: gallerySubTab === id ? 'linear-gradient(135deg, #6B0F0F, #4A0A0A)' : 'white',
                      color: gallerySubTab === id ? '#fff' : '#6B7280',
                      border: '1px solid',
                      borderColor: gallerySubTab === id ? 'transparent' : 'rgba(107,15,15,0.15)',
                      fontFamily: 'var(--font-heading)',
                      boxShadow: gallerySubTab === id ? '0 4px 12px rgba(107,15,15,0.3)' : 'none',
                    }}
                  >
                    <Icon size={14} />
                    {label}
                    <span className="px-2 py-0.5 rounded-full text-xs" style={{ backgroundColor: gallerySubTab === id ? 'rgba(255,255,255,0.2)' : 'rgba(107,15,15,0.08)', color: gallerySubTab === id ? '#fff' : '#6B0F0F', fontFamily: 'var(--font-heading)', fontWeight: 700 }}>
                      {count}
                    </span>
                  </button>
                ))}
              </div>

              {/* ── Gallery Images Sub-Tab ── */}
              {gallerySubTab === 'gallery' && (
                <div>
                  {/* Add Gallery Form */}
                  <div className="bg-white rounded-2xl p-5 mb-5 shadow-sm" style={{ border: '1px solid rgba(0,0,0,0.04)' }}>
                    <div className="flex items-center justify-between mb-4">
                      <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '15px', color: '#111' }}>Add New Gallery Image</h3>
                      <button
                        onClick={() => { setGalleryForm({ url: '', title: '', category: 'Food' }); setShowAddGallery(true); }}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:shadow-lg"
                        style={{ background: 'linear-gradient(135deg, #6B0F0F, #4A0A0A)', fontFamily: 'var(--font-heading)' }}
                      >
                        <Plus size={14} /> Add Image
                      </button>
                    </div>
                    <p style={{ fontSize: '13px', color: '#6B7280' }}>
                      {state.galleryImages.length} images across {['Restaurant', 'Food', 'Events', 'Kitchen'].map(cat => `${cat}: ${state.galleryImages.filter(g => g.category === cat).length}`).join(' • ')}
                    </p>
                  </div>

                  {/* Gallery Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                    {state.galleryImages.map(img => (
                      <div key={img.id} className="relative bg-white rounded-2xl overflow-hidden shadow-sm group" style={{ border: '1px solid rgba(0,0,0,0.04)' }}>
                        <div className="relative h-32 overflow-hidden">
                          <img src={img.url} alt={img.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          {/* Hover overlay with actions */}
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-2" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                            <button
                              onClick={() => {
                                setEditingGallery({ id: img.id, url: img.url, title: img.title, category: img.category });
                                setGalleryForm({ url: img.url, title: img.title, category: img.category });
                              }}
                              className="w-8 h-8 rounded-full flex items-center justify-center bg-white/90 hover:bg-white transition-colors"
                            >
                              <Edit2 size={12} style={{ color: '#1E40AF' }} />
                            </button>
                            <button
                              onClick={() => { dispatch({ type: 'DELETE_GALLERY_IMAGE', payload: img.id }); showNotification('Image removed.', 'info'); }}
                              className="w-8 h-8 rounded-full flex items-center justify-center bg-white/90 hover:bg-white transition-colors"
                            >
                              <Trash2 size={12} style={{ color: '#DC2626' }} />
                            </button>
                          </div>
                        </div>
                        <div className="p-2.5">
                          <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '11px', color: '#111' }} className="line-clamp-1">{img.title}</p>
                          <span className="inline-block px-1.5 py-0.5 rounded-md text-xs mt-1" style={{ backgroundColor: '#F0EDE8', color: '#6B7280', fontSize: '10px', fontFamily: 'var(--font-heading)' }}>{img.category}</span>
                        </div>
                      </div>
                    ))}
                    {state.galleryImages.length === 0 && (
                      <div className="col-span-full bg-white rounded-2xl py-16 text-center shadow-sm">
                        <Image size={40} className="mx-auto mb-3" style={{ color: '#D1D5DB' }} />
                        <p style={{ color: '#6B7280', fontSize: '14px' }}>No gallery images yet.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ── Carousel Slides Sub-Tab ── */}
              {gallerySubTab === 'carousel' && (
                <div>
                  <div className="bg-white rounded-2xl p-5 mb-5 shadow-sm" style={{ border: '1px solid rgba(0,0,0,0.04)' }}>
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '15px', color: '#111' }}>Homepage Carousel Slides</h3>
                        <p style={{ fontSize: '13px', color: '#6B7280', marginTop: '2px' }}>Manage the hero carousel displayed on the homepage</p>
                      </div>
                      <button
                        onClick={() => { setCarouselForm({ url: '', title: '', subtitle: '', description: '', badge: '' }); setShowAddCarousel(true); }}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:shadow-lg"
                        style={{ background: 'linear-gradient(135deg, #D4AF37, #B8960C)', color: '#1A0000', fontFamily: 'var(--font-heading)' }}
                      >
                        <Plus size={14} /> Add Slide
                      </button>
                    </div>
                  </div>

                  {/* Carousel Slides List */}
                  <div className="space-y-3">
                    {state.carouselSlides.map((slide, index) => (
                      <div key={slide.id} className="bg-white rounded-2xl overflow-hidden shadow-sm" style={{ border: '1px solid rgba(0,0,0,0.04)' }}>
                        <div className="flex items-stretch gap-0">
                          {/* Slide preview */}
                          <div className="relative w-48 h-28 flex-shrink-0">
                            <img src={slide.url} alt={slide.title} className="w-full h-full object-cover" />
                            <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(26,0,0,0.6), transparent)' }} />
                            <span className="absolute top-2 left-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: 'rgba(0,0,0,0.5)', fontFamily: 'var(--font-heading)' }}>
                              {index + 1}
                            </span>
                          </div>
                          {/* Slide info */}
                          <div className="flex-1 p-4 flex flex-col justify-center">
                            <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '15px', color: '#111', marginBottom: '2px' }}>{slide.title}</p>
                            {slide.subtitle && <p style={{ fontSize: '12px', color: '#6B7280', marginBottom: '4px' }}>{slide.subtitle}</p>}
                            {slide.badge && (
                              <span className="inline-block px-2 py-0.5 rounded-full text-xs font-bold self-start" style={{ background: 'linear-gradient(135deg, #D4AF37, #B8960C)', color: '#1A0000', fontFamily: 'var(--font-heading)' }}>
                                {slide.badge}
                              </span>
                            )}
                            {slide.description && <p style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '4px' }} className="line-clamp-1">{slide.description}</p>}
                          </div>
                          {/* Actions */}
                          <div className="flex flex-col justify-center gap-2 px-4 border-l" style={{ borderColor: 'rgba(0,0,0,0.05)' }}>
                            <button
                              onClick={() => {
                                setEditingCarousel(slide);
                                setCarouselForm({ url: slide.url, title: slide.title, subtitle: slide.subtitle, description: slide.description, badge: slide.badge });
                              }}
                              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all hover:shadow-sm"
                              style={{ backgroundColor: '#DBEAFE', color: '#1E40AF', fontFamily: 'var(--font-heading)' }}
                            >
                              <Edit2 size={11} /> Edit
                            </button>
                            <button
                              onClick={() => { dispatch({ type: 'DELETE_CAROUSEL_SLIDE', payload: slide.id }); showNotification('Slide removed.', 'info'); }}
                              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all hover:shadow-sm"
                              style={{ backgroundColor: '#FEE2E2', color: '#DC2626', fontFamily: 'var(--font-heading)' }}
                            >
                              <Trash2 size={11} /> Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    {state.carouselSlides.length === 0 && (
                      <div className="bg-white rounded-2xl py-16 text-center shadow-sm">
                        <Layers size={40} className="mx-auto mb-3" style={{ color: '#D1D5DB' }} />
                        <p style={{ color: '#6B7280', fontSize: '14px' }}>No carousel slides yet. Click "Add Slide" to add one.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ══ PAYMENTS ═══════════════════════════════════ */}
          {activeTab === 'payments' && (
            <div className="space-y-5">
              {/* Earnings Breakdown Section */}
              <div className="grid lg:grid-cols-2 gap-5">
                {/* Box 1: Online Orders */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-amber-100" style={{ borderLeft: '5px solid #6B0F0F' }}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '18px', color: '#111' }}>Online Orders</h3>
                    <div className="px-3 py-1 rounded-full text-[11px] font-bold" style={{ backgroundColor: '#FEE2E2', color: '#6B0F0F', letterSpacing: '0.5px' }}>DELIVERY / PICKUP</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-gray-50/50">
                      <p style={{ fontSize: '11px', color: '#6B7280', fontWeight: 600, textTransform: 'uppercase' }}>Today</p>
                      <p style={{ fontSize: '20px', fontWeight: 900, color: '#111', fontFamily: 'var(--font-heading)' }}>৳{state.orders.filter(o => new Date(o.createdAt).getTime() >= startOfToday).reduce((s, o) => s + o.total, 0).toLocaleString()}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-gray-50/50">
                      <p style={{ fontSize: '11px', color: '#6B7280', fontWeight: 600, textTransform: 'uppercase' }}>This Month</p>
                      <p style={{ fontSize: '20px', fontWeight: 900, color: '#111', fontFamily: 'var(--font-heading)' }}>৳{state.orders.filter(o => new Date(o.createdAt).getTime() >= startOfMonth).reduce((s, o) => s + o.total, 0).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-dashed flex justify-between items-end">
                    <div>
                      <p style={{ fontSize: '12px', color: '#9CA3AF' }}>Total Online Lifetime</p>
                      <p style={{ fontSize: '28px', fontWeight: 900, color: '#6B0F0F', fontFamily: 'var(--font-heading)' }}>৳{onlineRevenue.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <ShoppingBag size={24} style={{ color: 'rgba(107,15,15,0.1)' }} />
                    </div>
                  </div>
                </div>

                {/* Box 2: Table service */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-blue-50" style={{ borderLeft: '5px solid #2563EB' }}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '18px', color: '#111' }}>Table QR Service</h3>
                    <div className="px-3 py-1 rounded-full text-[11px] font-bold" style={{ backgroundColor: '#DBEAFE', color: '#2563EB', letterSpacing: '0.5px' }}>PHYSICAL DINING</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-gray-50/50">
                      <p style={{ fontSize: '11px', color: '#6B7280', fontWeight: 600, textTransform: 'uppercase' }}>Today</p>
                      <p style={{ fontSize: '20px', fontWeight: 900, color: '#111', fontFamily: 'var(--font-heading)' }}>৳{paidTableOrders.filter(o => o.createdAt >= startOfToday).reduce((s, o) => s + o.total, 0).toLocaleString()}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-gray-50/50">
                      <p style={{ fontSize: '11px', color: '#6B7280', fontWeight: 600, textTransform: 'uppercase' }}>This Month</p>
                      <p style={{ fontSize: '20px', fontWeight: 900, color: '#111', fontFamily: 'var(--font-heading)' }}>৳{paidTableOrders.filter(o => o.createdAt >= startOfMonth).reduce((s, o) => s + o.total, 0).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-dashed flex justify-between items-end">
                    <div>
                      <p style={{ fontSize: '12px', color: '#9CA3AF' }}>Total Table Lifetime</p>
                      <p style={{ fontSize: '28px', fontWeight: 900, color: '#2563EB', fontFamily: 'var(--font-heading)' }}>৳{tableRevenue.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <LayoutGrid size={24} style={{ color: 'rgba(37,99,235,0.1)' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Revenue Summary Cards (Redesign for combined view) */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  { label: 'Total Today', value: todayRevenue, icon: DollarSign, color: '#16A34A', bg: '#DCFCE7', sub: 'Combined' },
                  { label: 'Total Week', value: weeklyRevenue, icon: TrendingUp, color: '#2563EB', bg: '#DBEAFE', sub: 'Combined' },
                  { label: 'Total Month', value: monthlyRevenue, icon: CreditCard, color: '#7C3AED', bg: '#EDE9FE', sub: 'Combined' },
                  { label: 'Total All Time', value: totalRevenue, icon: Wallet, color: '#D4AF37', bg: '#FEF9EC', sub: 'Gross Revenue' },
                ].map(({ label, value, icon: Icon, color, bg, sub }) => (
                  <div key={label} className="bg-white p-4 rounded-xl shadow-sm" style={{ border: '1px solid rgba(0,0,0,0.05)' }}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: bg }}>
                        <Icon size={14} style={{ color }} />
                      </div>
                      <span style={{ fontSize: '10px', color: '#9CA3AF', fontWeight: 700, textTransform: 'uppercase' }}>{sub}</span>
                    </div>
                    <p style={{ fontSize: '11px', color: '#6B7280', fontWeight: 600 }}>{label}</p>
                    <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '20px', color: '#111', lineHeight: 1, marginTop: '2px' }}>৳{value.toLocaleString()}</p>
                  </div>
                ))}
              </div>

              {/* Weekly Bar Chart + Payment Methods */}
              <div className="grid lg:grid-cols-5 gap-5">
                {/* Weekly Revenue Bar Chart */}
                <div className="lg:col-span-3 bg-white rounded-2xl p-5 shadow-sm" style={{ border: '1px solid rgba(0,0,0,0.04)' }}>
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '15px', color: '#111' }}>Weekly Revenue</h3>
                      <p style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '2px' }}>Mon–Sun breakdown</p>
                    </div>
                    <div className="px-3 py-1.5 rounded-xl" style={{ backgroundColor: '#F0EDE8' }}>
                      <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '13px', color: '#6B0F0F' }}>৳{weeklyRevenue.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex items-end gap-2 h-36">
                    {weeklyBreakdown.map(({ day, rev }, i) => {
                      const isToday = i === dayOfWeek;
                      const pct = maxDayRev > 0 ? (rev / maxDayRev) * 100 : 0;
                      return (
                        <div key={day} className="flex-1 flex flex-col items-center gap-1">
                          {rev > 0 && (
                            <span style={{ fontSize: '9px', color: '#6B7280', fontFamily: 'var(--font-heading)', fontWeight: 600 }}>
                              {rev >= 1000 ? `${(rev/1000).toFixed(1)}k` : rev}
                            </span>
                          )}
                          <div className="w-full rounded-t-lg transition-all" style={{
                            height: `${Math.max(pct, rev > 0 ? 8 : 3)}%`,
                            background: isToday
                              ? 'linear-gradient(to top, #6B0F0F, #D4AF37)'
                              : rev > 0 ? 'linear-gradient(to top, #DBEAFE, #3B82F6)' : '#F3F4F6',
                            minHeight: '4px',
                          }} />
                          <span style={{ fontSize: '10px', color: isToday ? '#6B0F0F' : '#9CA3AF', fontFamily: 'var(--font-heading)', fontWeight: isToday ? 700 : 400 }}>{day}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Payment Method Breakdown */}
                <div className="lg:col-span-2 bg-white rounded-2xl p-5 shadow-sm" style={{ border: '1px solid rgba(0,0,0,0.04)' }}>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '15px', color: '#111', marginBottom: '16px' }}>All Payment Systems</h3>
                  <div className="space-y-5">
                    {[
                      { label: 'bKash', orders: bkashOrders.length, total: bkashTotal, color: '#E2136E', bg: '#FDF0F6', iconBg: 'rgba(226,19,110,0.12)', Icon: Smartphone },
                      { label: 'Nagad', orders: nagadOrders.length, total: nagadTotal, color: '#F7941D', bg: '#FFF4E8', iconBg: 'rgba(247,148,29,0.12)', Icon: CreditCard },
                      { label: 'Cash on Delivery', orders: codOrders.length, total: codTotal, color: '#16A34A', bg: '#F0FDF4', iconBg: 'rgba(22,163,74,0.12)', Icon: Banknote },
                      { label: 'Table Service', orders: paidTableOrders.length, total: tableTotal, color: '#2563EB', bg: '#DBEAFE', iconBg: 'rgba(37,99,235,0.12)', Icon: LayoutGrid },
                    ].map(({ label, orders, total, color, bg, iconBg, Icon }) => {
                      const pct = totalRevenue > 0 ? Math.round((total / totalRevenue) * 100) : 0;
                      return (
                        <div key={label}>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: iconBg }}>
                                <Icon size={15} style={{ color }} />
                              </div>
                              <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '13px', color: '#1F2937' }}>{label}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span style={{ fontSize: '11px', color: '#9CA3AF' }}>{orders} {label === 'Table Service' ? 'tables' : 'orders'}</span>
                              <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ backgroundColor: bg, color, fontFamily: 'var(--font-heading)' }}>{pct}%</span>
                            </div>
                          </div>
                          <div className="w-full h-2.5 rounded-full overflow-hidden" style={{ backgroundColor: bg }}>
                            <div className="h-2.5 rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${color}99, ${color})` }} />
                          </div>
                          <div className="flex items-center justify-between mt-1.5">
                            <p style={{ fontSize: '12px', color, fontFamily: 'var(--font-heading)', fontWeight: 800 }}>৳{total.toLocaleString()}</p>
                            <p style={{ fontSize: '10px', color: '#9CA3AF' }}>of ৳{totalRevenue.toLocaleString()}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* All Payment Transactions */}
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden" style={{ border: '1px solid rgba(0,0,0,0.04)' }}>
                <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'rgba(0,0,0,0.05)' }}>
                  <div>
                    <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '15px', color: '#111' }}>All Payment Transactions</h3>
                    <p style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '2px' }}>{allPaidOrders.length} total payments received</p>
                  </div>
                  <div className="flex gap-2">
                    {[
                      { label: 'Online', count: state.orders.length, color: '#6B0F0F', bg: '#FEE2E2' },
                      { label: 'Table Service', count: paidTableOrders.length, color: '#2563EB', bg: '#DBEAFE' },
                    ].map(({ label, count, color, bg }) => (
                      <span key={label} className="px-2.5 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: bg, color, fontFamily: 'var(--font-heading)' }}>
                        {label}: {count}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr style={{ backgroundColor: '#FDF8F0', borderBottom: '1px solid rgba(107,15,15,0.08)' }}>
                        {['#', 'Ref No.', 'Customer / Table', 'Amount', 'Type / Method', 'Status', 'Date'].map(h => (
                          <th key={h} className="px-4 py-3 text-left" style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '10px', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.7px' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[...allPaidOrders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((order: any, idx) => {
                        const isTable = order.type === 'Table';
                        const methodColors: Record<string, { color: string; bg: string }> = {
                          'bKash':             { color: '#E2136E', bg: '#FDF0F6' },
                          'Nagad':             { color: '#F7941D', bg: '#FFF4E8' },
                          'Cash on Delivery':  { color: '#16A34A', bg: '#F0FDF4' },
                          'Table':             { color: '#2563EB', bg: '#DBEAFE' },
                        };
                        const mc = methodColors[isTable ? 'Table' : order.paymentMethod] || { color: '#6B7280', bg: '#F3F4F6' };
                        return (
                          <tr key={order.id!} className="border-b hover:bg-gray-50/50 transition-colors" style={{ borderColor: 'rgba(0,0,0,0.04)' }}>
                            <td className="px-4 py-3" style={{ fontSize: '12px', color: '#9CA3AF' }}>{allPaidOrders.length - idx}</td>
                            <td className="px-4 py-3">
                              <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '13px', color: isTable ? '#2563EB' : '#6B0F0F' }}>
                                #{isTable ? `TBL-${order.tableNumber}` : order.orderNumber}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <p style={{ fontSize: '13px', fontWeight: 600, color: '#111', fontFamily: 'var(--font-heading)' }}>
                                {isTable ? `Table ${order.tableNumber}` : order.customerName}
                              </p>
                              <p style={{ fontSize: '11px', color: '#9CA3AF' }}>
                                {isTable ? `${order.items.length} dishes served` : order.phone}
                              </p>
                            </td>
                            <td className="px-4 py-3">
                              <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '14px', color: '#16A34A' }}>৳{order.total.toLocaleString()}</span>
                            </td>
                            <td className="px-4 py-3">
                                <div className="flex flex-col gap-1">
                                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold text-center" style={{ backgroundColor: mc.bg, color: mc.color, fontFamily: 'var(--font-heading)' }}>
                                        {isTable ? 'Table Service' : order.paymentMethod}
                                    </span>
                                </div>
                            </td>
                            <td className="px-4 py-3">
                              <span className="px-2.5 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: '#D1FAE5', color: '#065F46', fontFamily: 'var(--font-heading)' }}>
                                Paid
                              </span>
                            </td>
                            <td className="px-4 py-3" style={{ fontSize: '12px', color: '#6B7280' }}>
                              {new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' })}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  {allPaidOrders.length === 0 && (
                    <div className="py-20 text-center">
                      <CreditCard size={40} className="mx-auto mb-3" style={{ color: '#D1D5DB' }} />
                      <p style={{ color: '#6B7280', fontSize: '15px' }}>No payment records yet.</p>
                      <p style={{ color: '#9CA3AF', fontSize: '13px', marginTop: '4px' }}>Payments will appear here once orders/tables are paid.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ══ MESSAGES ═══════════════════════════════════ */}
          {activeTab === 'messages' && (
            <div className="space-y-4">
              {state.messages.map(msg => (
                <div
                  key={msg.id}
                  className="bg-white rounded-2xl p-5 shadow-sm"
                  style={{ border: `1px solid ${!msg.isRead ? 'rgba(107,15,15,0.2)' : 'rgba(0,0,0,0.04)'}`, backgroundColor: !msg.isRead ? '#FFFAF7' : 'white' }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow" style={{ background: 'linear-gradient(135deg, #6B0F0F, #D4AF37)', fontFamily: 'var(--font-heading)', fontSize: '16px' }}>
                        {msg.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '14px', color: '#111' }}>{msg.name}</p>
                          {!msg.isRead && <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: '#6B0F0F' }} />}
                        </div>
                        <p style={{ fontSize: '12px', color: '#6B7280' }}>{msg.email} • {msg.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <span style={{ fontSize: '11px', color: '#9CA3AF' }}>{new Date(msg.createdAt!).toLocaleDateString()}</span>
                      <button onClick={() => dispatch({ type: 'READ_MESSAGE', payload: msg.id! })} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors" title="Mark as read">
                        <Eye size={14} style={{ color: '#6B7280' }} />
                      </button>
                      <button
                        onClick={() => setReplyingTo({ id: msg.id!, name: msg.name })}
                        className="p-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                        title="Reply"
                      >
                        <Send size={14} style={{ color: '#2563EB' }} />
                      </button>
                      <button onClick={() => { dispatch({ type: 'DELETE_MESSAGE', payload: msg.id! }); showNotification('Message deleted.', 'info'); }} className="p-1.5 rounded-lg hover:bg-red-50 transition-colors" title="Delete">
                        <Trash2 size={14} style={{ color: '#DC2626' }} />
                      </button>
                    </div>
                  </div>
                  {msg.subject && (
                    <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '13px', color: '#374151', marginBottom: '6px' }}>
                      Subject: {msg.subject}
                    </p>
                  )}
                  <div className="p-3.5 rounded-xl" style={{ backgroundColor: '#F9F5F0' }}>
                    <p style={{ fontSize: '14px', color: '#374151', lineHeight: '1.6' }}>{msg.message}</p>
                  </div>
                  {msg.reply && (
                    <div className="mt-3 p-3.5 rounded-xl flex gap-3" style={{ backgroundColor: 'rgba(107,15,15,0.05)', border: '1px solid rgba(107,15,15,0.1)' }}>
                      <Send size={14} style={{ color: '#6B0F0F', marginTop: '2px', flexShrink: 0 }} />
                      <div>
                        <p style={{ fontSize: '11px', color: '#6B0F0F', fontWeight: 700, marginBottom: '3px', fontFamily: 'var(--font-heading)' }}>Your Reply</p>
                        <p style={{ fontSize: '13px', color: '#374151' }}>{msg.reply}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {state.messages.length === 0 && (
                <div className="bg-white rounded-2xl py-20 text-center shadow-sm">
                  <MessageSquare size={44} className="mx-auto mb-3" style={{ color: '#D1D5DB' }} />
                  <p style={{ color: '#6B7280', fontSize: '15px' }}>No messages yet.</p>
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      {/* ── Modals ─────────────────────────────────────── */}

      {/* Add Menu Item Modal */}
      {showAddMenu && (
        <MenuItemModal
          title="Add New Menu Item"
          form={menuForm}
          setForm={setMenuForm}
          onSave={handleSaveMenuItem}
          onClose={() => { setShowAddMenu(false); setMenuForm(blankMenuForm); }}
        />
      )}

      {/* Edit Menu Item Modal */}
      {editingMenuItem && (
        <MenuItemModal
          title={`Edit: ${editingMenuItem.name}`}
          form={menuForm}
          setForm={setMenuForm}
          onSave={handleSaveMenuItem}
          onClose={() => { setEditingMenuItem(null); setMenuForm(blankMenuForm); }}
        />
      )}

      {/* Add Gallery Image Modal */}
      {showAddGallery && (
        <GalleryEditModal
          title="Add Gallery Image"
          form={galleryForm}
          setForm={setGalleryForm}
          onSave={handleSaveGallery}
          onClose={() => { setShowAddGallery(false); setGalleryForm({ url: '', title: '', category: 'Food' }); }}
        />
      )}

      {/* Edit Gallery Image Modal */}
      {editingGallery && (
        <GalleryEditModal
          title="Edit Gallery Image"
          form={galleryForm}
          setForm={setGalleryForm}
          onSave={handleSaveGallery}
          onClose={() => { setEditingGallery(null); setGalleryForm({ url: '', title: '', category: 'Food' }); }}
        />
      )}

      {/* Add Carousel Slide Modal */}
      {showAddCarousel && (
        <CarouselSlideModal
          title="Add Carousel Slide"
          form={carouselForm}
          setForm={setCarouselForm}
          onSave={handleSaveCarousel}
          onClose={() => { setShowAddCarousel(false); setCarouselForm({ url: '', title: '', subtitle: '', description: '', badge: '' }); }}
        />
      )}

      {/* Edit Carousel Slide Modal */}
      {editingCarousel && (
        <CarouselSlideModal
          title="Edit Carousel Slide"
          form={carouselForm}
          setForm={setCarouselForm}
          onSave={handleSaveCarousel}
          onClose={() => { setEditingCarousel(null); setCarouselForm({ url: '', title: '', subtitle: '', description: '', badge: '' }); }}
        />
      )}

      {/* Reply Modal */}
      {replyingTo && (
        <ReplyModal
          msgId={replyingTo.id}
          msgName={replyingTo.name}
          onSend={(id, reply) => {
            dispatch({ type: 'REPLY_MESSAGE', payload: { id, reply } });
            showNotification('Reply saved!', 'success');
          }}
          onClose={() => setReplyingTo(null)}
        />
      )}

      {/* Order Details Modal */}
      {viewingOrder && (
        <OrderDetailsModal 
           order={viewingOrder}
           onClose={() => setViewingOrder(null)}
        />
      )}
    </div>
  );
}
