import { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams } from 'react-router';
import {
  CheckCircle, ChefHat, Bell, Utensils, FileText,
  Star, Clock, Search, ShoppingCart, Plus, Minus,
  Trash2, ChevronDown, ChevronUp, X, Filter, Flame, Leaf, Eye, Users
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { TableOrder as TableOrderData } from '../context/AppContext';

// ─── Status config ────────────────────────────────────────────────────────────
const statusConfig = {
  Pending:   { label: 'Order Received',  icon: CheckCircle, color: '#2563EB', bg: '#DBEAFE', step: 0 },
  Confirmed: { label: 'Confirmed',       icon: CheckCircle, color: '#7C3AED', bg: '#EDE9FE', step: 1 },
  Cooking:   { label: 'Cooking',         icon: ChefHat,     color: '#EA580C', bg: '#FEF3C7', step: 2 },
  Ready:     { label: 'Ready to Serve',  icon: Bell,        color: '#16A34A', bg: '#DCFCE7', step: 3 },
  Served:    { label: 'Served',          icon: Utensils,    color: '#6B7280', bg: '#F3F4F6', step: 4 },
  Paid:      { label: 'Paid',            icon: FileText,    color: '#6B7280', bg: '#F3F4F6', step: 5 },
};

const cookingStages = [
  { key: 'Pending',   label: 'Order Received', icon: CheckCircle, desc: 'Your order has been received!' },
  { key: 'Confirmed', label: 'Confirmed',      icon: CheckCircle, desc: 'Staff confirmed your order' },
  { key: 'Cooking',   label: 'Cooking',        icon: ChefHat,     desc: 'Our chef is preparing your food' },
  { key: 'Ready',     label: 'Ready!',         icon: Bell,        desc: 'Food is ready to be served' },
];

const spiceLevels = ['All', 'Mild', 'Medium', 'Hot', 'Extra Hot'];
const spiceColors: Record<string, string> = {
  Mild: '#16A34A',
  Medium: '#D97706',
  Hot: '#DC2626',
  'Extra Hot': '#7C3AED',
};

interface LocalCartItem {
  item: {
    id: string;
    name: string;
    price: number;
    image: string;
    category: string;
    description: string;
    rating: number;
    spiceLevel: string;
    isVeg: boolean;
  };
  quantity: number;
  note: string;
}

function StarRating({ rating, size = 11 }: { rating: number; size?: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} size={size} fill={i <= Math.floor(rating) ? '#D4AF37' : 'none'}
          style={{ color: i <= Math.floor(rating) ? '#D4AF37' : '#D1D5DB' }} />
      ))}
    </div>
  );
}

// ─── Elapsed Timer ────────────────────────────────────────────────────────────
function ElapsedTimer({ since }: { since: number }) {
  const [elapsed, setElapsed] = useState(Math.floor((Date.now() - since) / 1000));
  useEffect(() => {
    const id = setInterval(() => setElapsed(Math.floor((Date.now() - since) / 1000)), 1000);
    return () => clearInterval(id);
  }, [since]);
  const m = Math.floor(elapsed / 60);
  const s = elapsed % 60;
  return <span>{m}:{String(s).padStart(2, '0')}</span>;
}

// ─── Dish Detail Overlay ──────────────────────────────────────────────────────
function DishDetailOverlay({
  item,
  onClose,
  onAdd,
  inCartQuantity,
  updateQty
}: {
  item: any;
  onClose: () => void;
  onAdd: (item: any, qty: number, note: string) => void;
  inCartQuantity: number;
  updateQty: (id: string, qty: number) => void;
}) {
  const [qty, setQty] = useState(inCartQuantity || 1);
  const [note, setNote] = useState('');
  const [activeTab, setActiveTab] = useState<'description' | 'ingredients' | 'nutrition'>('description');

  const spiceColors: Record<string, string> = { Mild: '#16A34A', Medium: '#D97706', Hot: '#DC2626', 'Extra Hot': '#7C3AED' };

  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-[#F9F5F0] overflow-y-auto animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Header / Back */}
      <div className="sticky top-0 z-10 px-4 py-4 flex items-center justify-between bg-[#F9F5F0]/80 backdrop-blur-md border-b border-gray-100">
        <button onClick={onClose} className="w-10 h-10 rounded-full flex items-center justify-center bg-white shadow-sm border border-gray-100 transition-all active:scale-90">
          <X size={20} style={{ color: '#6B0F0F' }} />
        </button>
        <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '15px', color: '#111' }}>Dish Details</span>
        <div className="w-10" /> {/* Spacer */}
      </div>

      <div className="flex-1 max-w-2xl mx-auto w-full pb-32">
        {/* Hero Image */}
        <div className="relative h-72 sm:h-96 w-full overflow-hidden sm:rounded-b-[40px]">
          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-6 left-6 right-6">
            <div className="flex gap-2 mb-2">
              {item.isPopular && <span className="premium-badge">★ Popular</span>}
              {item.isVeg && <span className="px-2.5 py-1 rounded-full text-[10px] font-bold text-white" style={{ backgroundColor: '#16A34A' }}>Veg</span>}
            </div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '28px', color: '#fff', lineHeight: 1.2 }}>{item.name}</h1>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span style={{ color: '#D4AF37', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>{item.category}</span>
              <div className="flex items-center gap-2 mt-1">
                <StarRating rating={item.rating} size={14} />
                <span style={{ fontSize: '12px', color: '#6B7280', fontWeight: 600 }}>({item.rating})</span>
              </div>
            </div>
            <div className="text-right">
              <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '32px', color: '#6B0F0F' }}>৳{item.price}</span>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex flex-wrap gap-3 mb-8">
            {[
              { icon: Clock, label: item.prepTime, color: '#2563EB' },
              { icon: Users, label: item.serves, color: '#7C3AED' },
              { icon: Flame, label: item.spiceLevel, color: spiceColors[item.spiceLevel] },
            ].map(({ icon: Icon, label, color }) => (
              <div key={label} className="flex items-center gap-2 px-3.5 py-2 rounded-2xl text-[11px] font-bold" style={{ backgroundColor: `${color}10`, color, border: `1px solid ${color}20` }}>
                <Icon size={14} /> {label}
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="mb-8">
            <div className="flex gap-6 border-b border-gray-200 mb-6">
              {(['description', 'ingredients', 'nutrition'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className="pb-3 text-xs font-bold uppercase letter-spacing-[1px] relative transition-all"
                  style={{ color: activeTab === tab ? '#6B0F0F' : '#9CA3AF' }}
                >
                  {tab}
                  {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: 'linear-gradient(90deg, #6B0F0F, #D4AF37)' }} />}
                </button>
              ))}
            </div>
            <div className="min-h-[100px]">
              {activeTab === 'description' && <p style={{ color: '#374151', fontSize: '14px', lineHeight: 1.7 }}>{item.description}</p>}
              {activeTab === 'ingredients' && (
                <div className="flex flex-wrap gap-2">
                  {item.ingredients.map((ing: string) => (
                    <span key={ing} className="px-4 py-2 rounded-xl text-[12px] font-bold bg-white text-[#374151] border border-gray-100 shadow-sm">{ing}</span>
                  ))}
                </div>
              )}
              {activeTab === 'nutrition' && (
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Calories', value: item.nutrition.calories, unit: 'kcal', color: '#DC2626' },
                    { label: 'Protein', value: item.nutrition.protein, unit: 'g', color: '#2563EB' },
                    { label: 'Carbs', value: item.nutrition.carbs, unit: 'g', color: '#D97706' },
                    { label: 'Fat', value: item.nutrition.fat, unit: 'g', color: '#16A34A' },
                  ].map(n => (
                    <div key={n.label} className="p-4 rounded-2xl bg-white border border-gray-100 shadow-sm">
                      <div style={{ color: n.color, fontSize: '20px', fontWeight: 900 }}>{n.value}{n.unit}</div>
                      <div style={{ color: '#6B7280', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', marginTop: '2px' }}>{n.label}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Add Section */}
          <div className="p-6 rounded-3xl bg-white border border-gray-100 shadow-md">
            <h4 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '15px', color: '#111', marginBottom: '16px' }}>Customize your order</h4>
            
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4 bg-[#F9F5F0] p-1 rounded-2xl">
                <button
                  onClick={() => setQty(q => Math.max(1, q - 1))}
                  className="w-10 h-10 rounded-xl flex items-center justify-center bg-white shadow-sm transition-all active:scale-90"
                  style={{ color: '#6B0F0F' }}
                >
                  <Minus size={16} />
                </button>
                <span style={{ fontSize: '18px', fontWeight: 900, color: '#111', minWidth: '24px', textAlign: 'center' }}>{qty}</span>
                <button
                  onClick={() => setQty(q => q + 1)}
                  className="w-10 h-10 rounded-xl flex items-center justify-center bg-white shadow-sm transition-all active:scale-90"
                  style={{ color: '#6B0F0F' }}
                >
                  <Plus size={16} />
                </button>
              </div>
              <div className="text-right">
                <p style={{ color: '#6B7280', fontSize: '12px', fontWeight: 600 }}>Subtotal</p>
                <p style={{ fontSize: '24px', fontWeight: 900, color: '#6B0F0F' }}>৳{item.price * qty}</p>
              </div>
            </div>

            <div className="mb-6">
              <label style={{ color: '#6B7280', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Special Instructions</label>
              <textarea
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="e.g. Extra spicy, no onions, etc."
                className="w-full px-4 py-3 rounded-2xl bg-[#F9F5F0] border-none outline-none text-sm min-h-[80px] resize-none"
              />
            </div>

            <button
              onClick={() => { onAdd(item, qty, note); onClose(); }}
              className="w-full py-4 rounded-2xl text-white font-bold text-lg flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-lg"
              style={{ background: 'linear-gradient(135deg, #6B0F0F, #4A0A0A)' }}
            >
              <ShoppingCart size={20} />
              {inCartQuantity > 0 ? 'Update Order' : 'Add to Order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TableOrder() {
  const { tableId } = useParams<{ tableId: string }>();
  const { state, placeTableOrder } = useApp();

  const table = state.tables.find(t => t.id === tableId);
  const activeOrder = state.tableOrders.find(
    o => o.tableId === tableId && !['Served', 'Paid'].includes(o.status)
  );

  // Local cart
  const [cart, setCart] = useState<LocalCartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [spiceFilter, setSpiceFilter] = useState('All');
  const [vegOnly, setVegOnly] = useState(false);
  const [spicyOnly, setSpicyOnly] = useState(false);
  const [sortBy, setSortBy] = useState('popular');
  const [maxPrice, setMaxPrice] = useState(1000);
  const [showFilters, setShowFilters] = useState(false);
  const [customerNote, setCustomerNote] = useState('');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [selectedItemSlug, setSelectedItemSlug] = useState<string | null>(null);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(state.menuItems.map(i => i.category)));
    return ['All', ...cats];
  }, [state.menuItems]);

  const filtered = useMemo(() => {
    let items = [...state.menuItems];

    if (activeCategory !== 'All') items = items.filter(i => i.category === activeCategory);
    if (search) items = items.filter(i => i.name.toLowerCase().includes(search.toLowerCase()) || i.description.toLowerCase().includes(search.toLowerCase()));
    if (spiceFilter !== 'All') items = items.filter(i => i.spiceLevel === spiceFilter);
    if (vegOnly) items = items.filter(i => i.isVeg);
    if (spicyOnly) items = items.filter(i => i.isSpicy);
    items = items.filter(i => i.price <= maxPrice);

    switch (sortBy) {
      case 'popular': items.sort((a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0)); break;
      case 'rating': items.sort((a, b) => b.rating - a.rating); break;
      case 'price-low': items.sort((a, b) => a.price - b.price); break;
      case 'price-high': items.sort((a, b) => b.price - a.price); break;
    }

    return items;
  }, [state.menuItems, activeCategory, search, spiceFilter, vegOnly, spicyOnly, maxPrice, sortBy]);

  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);
  const cartTotal = cart.reduce((s, i) => s + i.item.price * i.quantity, 0);

  const addToLocalCart = useCallback((item: typeof filtered[0]) => {
    setCart(prev => {
      const ex = prev.find(c => c.item.id === item.id);
      if (ex) return prev.map(c => c.item.id === item.id ? { ...c, quantity: c.quantity + 1 } : c);
      return [...prev, {
        item: { id: item.id, name: item.name, price: item.price, image: item.image, category: item.category, description: item.description, rating: item.rating, spiceLevel: item.spiceLevel, isVeg: item.isVeg },
        quantity: 1,
        note: '',
      }];
    });
  }, []);

  const updateQty = (id: string, qty: number) => {
    if (qty <= 0) {
      setCart(prev => prev.filter(c => c.item.id !== id));
    } else {
      setCart(prev => prev.map(c => c.item.id === id ? { ...c, quantity: qty } : c));
    }
  };

  const updateNote = (id: string, note: string) => {
    setCart(prev => prev.map(c => c.item.id === id ? { ...c, note } : c));
  };

  const handlePlaceOrder = () => {
    if (cart.length === 0 || !table) return;
    const orderId = `TBL-${Date.now()}`;
    const order: TableOrderData = {
      id: orderId,
      tableId: table.id,
      tableNumber: table.tableNumber,
      items: cart.map(c => ({
        itemId: c.item.id,
        name: c.item.name,
        price: c.item.price,
        quantity: c.quantity,
        note: c.note,
        image: c.item.image,
      })),
      total: cartTotal,
      status: 'Pending',
      createdAt: Date.now(),
      customerNote,
    };
    placeTableOrder(order);
    setCart([]);
    setCartOpen(false);
    setOrderPlaced(true);
  };

  // Track live status for animation triggers
  const [liveStatus, setLiveStatus] = useState<string>('');
  useEffect(() => {
    if (activeOrder) setLiveStatus(activeOrder.status);
  }, [activeOrder]);

  // The AppContext storage event listener (added in AppContext.tsx) handles
  // cross-tab sync automatically, so this component will re-render whenever
  // the Admin or Kitchen Display updates the order status.

  // After order placed, re-read from context
  const placedOrder = state.tableOrders.find(
    o => o.tableId === tableId && !['Served', 'Paid'].includes(o.status)
  );
  const currentStage = placedOrder ? statusConfig[placedOrder.status as keyof typeof statusConfig] : null;

  // ── Table not found ──────────────────────────────────────────────────────────
  if (!table) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #1A0000, #4A0A0A)' }}>
        <div className="text-center text-white px-6">
          <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: 'rgba(212,175,55,0.12)', border: '2px solid rgba(212,175,55,0.2)' }}>
            <Utensils size={40} style={{ color: 'rgba(212,175,55,0.6)' }} />
          </div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '26px', fontWeight: 800, marginBottom: '12px' }}>Table Not Found</h1>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '15px', lineHeight: 1.6, maxWidth: '280px', margin: '0 auto' }}>This QR code is not linked to a valid table. Please ask staff for assistance.</p>
        </div>
      </div>
    );
  }

  // ── Confirmation / Order tracking screen ─────────────────────────────────────
  if (orderPlaced || placedOrder) {
    const order = placedOrder;
    const stepIndex = order ? (statusConfig[order.status as keyof typeof statusConfig]?.step ?? 0) : 0;

    return (
      <div className="min-h-screen" style={{ background: 'linear-gradient(160deg, #1A0000 0%, #2D0000 40%, #4A0A0A 100%)' }}>
        {/* Header */}
        <div className="px-6 py-5 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="flex items-center gap-3">
            <div>
              <p style={{ color: '#fff', fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '14px', lineHeight: 1 }}>Rizqara</p>
              <p style={{ color: '#D4AF37', fontSize: '10px', fontFamily: 'var(--font-heading)', fontWeight: 600, letterSpacing: '1px' }}>TABLE {table.tableNumber}</p>
            </div>
          </div>
          <div className="px-3 py-1.5 rounded-full" style={{ background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.3)' }}>
            <span style={{ color: '#D4AF37', fontSize: '12px', fontFamily: 'var(--font-heading)', fontWeight: 700 }}>{table.area} Area</span>
          </div>
        </div>

        <div className="max-w-md mx-auto px-5 py-8">
          {/* Thank you banner */}
          <div className="text-center mb-8">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5 shadow-2xl"
              style={{ background: 'linear-gradient(135deg, #D4AF37, #B8960C)' }}
            >
              <ChefHat size={36} style={{ color: '#1A0000' }} />
            </div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '26px', color: '#fff', marginBottom: '8px' }}>
              Thank you for your order!
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px' }}>
              Our kitchen is working on your order. Sit back & relax!
            </p>
            {order && (
              <div className="mt-3 flex items-center justify-center gap-2">
                <Clock size={13} style={{ color: '#D4AF37' }} />
                <span style={{ color: '#D4AF37', fontSize: '13px', fontFamily: 'var(--font-heading)', fontWeight: 600 }}>
                  Elapsed: <ElapsedTimer since={order.createdAt} />
                </span>
              </div>
            )}
          </div>

          {/* Cooking Progress */}
          <div className="p-5 rounded-2xl mb-5" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', fontFamily: 'var(--font-heading)', fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '16px' }}>Order Progress</p>
            <div className="space-y-4">
              {cookingStages.map((stage, idx) => {
                const Icon = stage.icon;
                const isActive = idx === stepIndex;
                const isDone = idx < stepIndex;
                return (
                  <div key={stage.key} className="flex items-center gap-4">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-500"
                      style={{
                        background: isDone ? 'linear-gradient(135deg, #16A34A, #15803D)' : isActive ? 'linear-gradient(135deg, #D4AF37, #B8960C)' : 'rgba(255,255,255,0.08)',
                        border: isActive ? '2px solid rgba(212,175,55,0.5)' : '2px solid transparent',
                        boxShadow: isActive ? '0 0 20px rgba(212,175,55,0.4)' : 'none',
                      }}
                    >
                      <Icon size={18} style={{ color: isDone || isActive ? (isDone ? '#fff' : '#1A0000') : 'rgba(255,255,255,0.3)' }} />
                    </div>
                    <div className="flex-1">
                      <p style={{
                        fontFamily: 'var(--font-heading)',
                        fontWeight: 700,
                        fontSize: '14px',
                        color: isDone ? '#86EFAC' : isActive ? '#D4AF37' : 'rgba(255,255,255,0.35)',
                        transition: 'color 0.5s',
                      }}>
                        {stage.label}
                        {isActive && (
                          <span style={{ fontSize: '11px', marginLeft: '8px', opacity: 0.8 }}>← Current</span>
                        )}
                      </p>
                      {isActive && (
                        <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginTop: '2px' }}>{stage.desc}</p>
                      )}
                    </div>
                    {isDone && (
                      <CheckCircle size={16} style={{ color: '#86EFAC', flexShrink: 0 }} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order summary */}
          {order && (
            <div className="p-5 rounded-2xl mb-5" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', fontFamily: 'var(--font-heading)', fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '14px' }}>Your Order</p>
              <div className="space-y-3">
                {order.items.map(item => (
                  <div key={item.itemId} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src={item.image} alt={item.name} className="w-10 h-10 rounded-xl object-cover" />
                      <div>
                        <p style={{ color: '#fff', fontSize: '13px', fontFamily: 'var(--font-heading)', fontWeight: 600 }}>{item.name}</p>
                        {item.note && <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px' }}>{item.note}</p>}
                      </div>
                    </div>
                    <div className="text-right">
                      <p style={{ color: '#D4AF37', fontSize: '13px', fontFamily: 'var(--font-heading)', fontWeight: 700 }}>×{item.quantity}</p>
                      <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px' }}>৳{item.price * item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="flex justify-between items-center">
                  <p style={{ color: 'rgba(255,255,255,0.7)', fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '14px' }}>Total</p>
                  <p style={{ color: '#D4AF37', fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '20px' }}>৳{order.total}</p>
                </div>
              </div>
            </div>
          )}

          {/* Status badge */}
          {order && (
            <div className="text-center">
              {(() => {
                const cfg = statusConfig[order.status as keyof typeof statusConfig];
                const StatusIcon = cfg.icon;
                return (
                  <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full" style={{ backgroundColor: cfg.bg }}>
                    <StatusIcon size={15} style={{ color: cfg.color }} />
                    <span style={{ color: cfg.color, fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '14px' }}>
                      {cfg.label}
                    </span>
                  </div>
                );
              })()}
            </div>
          )}

          <p className="text-center mt-6" style={{ color: 'rgba(255,255,255,0.35)', fontSize: '12px' }}>
            Payment is handled by staff at the table. Thank you!
          </p>
        </div>
      </div>
    );
  }

  // ── Main Ordering Screen ──────────────────────────────────────────────────────
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F9F5F0' }}>
      {/* Header */}
      <div
        className="sticky top-0 z-40 px-4 py-4 flex flex-col gap-3"
        style={{ background: 'linear-gradient(135deg, #1A0000, #4A0A0A)', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div>
              <p style={{ color: '#fff', fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '15px', lineHeight: 1.2 }}>Rizqara Restaurant</p>
              <p style={{ color: '#D4AF37', fontSize: '10px', fontFamily: 'var(--font-heading)', fontWeight: 600, letterSpacing: '1px', marginTop: '2px' }}>
                Table {table.tableNumber} · {table.area} Area
              </p>
            </div>
          </div>
          <button
            onClick={() => setCartOpen(true)}
            className="relative flex items-center gap-2 px-4 py-2 rounded-xl transition-all"
            style={{ background: cartCount > 0 ? 'linear-gradient(135deg, #D4AF37, #B8960C)' : 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }}
          >
            <ShoppingCart size={16} style={{ color: cartCount > 0 ? '#1A0000' : '#fff' }} />
            {cartCount > 0 && (
              <>
                <span style={{ color: '#1A0000', fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '13px' }}>৳{cartTotal}</span>
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center" style={{ fontSize: '10px', fontWeight: 700 }}>{cartCount}</span>
              </>
            )}
            {cartCount === 0 && <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px', fontFamily: 'var(--font-heading)' }}>Cart</span>}
          </button>
        </div>

        {/* Search & Filter Trigger */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'rgba(255,255,255,0.5)' }} />
            <input
              type="text"
              placeholder="Search dishes..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-white placeholder:text-white/40 border-none outline-none text-sm"
              style={{ backgroundColor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.1)' }}
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="p-2.5 rounded-xl flex items-center justify-center transition-all"
            style={{
              backgroundColor: showFilters ? '#D4AF37' : 'rgba(255,255,255,0.1)',
              color: showFilters ? '#1A0000' : '#fff',
              border: '1px solid rgba(255,255,255,0.1)'
            }}
          >
            <Filter size={18} />
          </button>
        </div>

        {/* Filters Panel (Mobile Friendly) */}
        {showFilters && (
          <div className="mt-2 p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <label style={{ color: '#fff', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Sort By</label>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="bg-transparent text-[#D4AF37] text-xs font-bold outline-none"
              >
                <option value="popular">Popular</option>
                <option value="rating">Top Rated</option>
                <option value="price-low">Price: Low-High</option>
                <option value="price-high">Price: High-Low</option>
              </select>
            </div>

            <div>
              <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', display: 'block', marginBottom: '8px', textTransform: 'uppercase' }}>Spice Level</label>
              <div className="flex flex-wrap gap-2">
                {spiceLevels.map(level => (
                  <button
                    key={level}
                    onClick={() => setSpiceFilter(level)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all"
                    style={{
                      backgroundColor: spiceFilter === level ? '#D4AF37' : 'transparent',
                      color: spiceFilter === level ? '#1A0000' : '#fff',
                      borderColor: spiceFilter === level ? '#D4AF37' : 'rgba(255,255,255,0.2)'
                    }}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setVegOnly(!vegOnly)}
                className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold border transition-all"
                style={{
                  backgroundColor: vegOnly ? '#16A34A' : 'transparent',
                  color: '#fff',
                  borderColor: vegOnly ? '#16A34A' : 'rgba(255,255,255,0.2)'
                }}
              >
                <Leaf size={14} /> Veg Only
              </button>
              <button
                onClick={() => setSpicyOnly(!spicyOnly)}
                className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold border transition-all"
                style={{
                  backgroundColor: spicyOnly ? '#DC2626' : 'transparent',
                  color: '#fff',
                  borderColor: spicyOnly ? '#DC2626' : 'rgba(255,255,255,0.2)'
                }}
              >
                <Flame size={14} /> Spicy
              </button>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', textTransform: 'uppercase' }}>Max Price: ৳{maxPrice}</label>
                <button onClick={() => { setSpiceFilter('All'); setVegOnly(false); setSpicyOnly(false); setMaxPrice(1000); setSortBy('popular'); }} className="text-xs text-[#D4AF37] font-bold">Reset</button>
              </div>
              <input
                type="range"
                min={80}
                max={1000}
                step={20}
                value={maxPrice}
                onChange={e => setMaxPrice(+e.target.value)}
                className="w-full accent-[#D4AF37]"
              />
            </div>
          </div>
        )}
      </div>

      {/* Category Tabs */}
      <div className="px-4 py-4 flex gap-2 overflow-x-auto bg-[#F9F5F0]" style={{ scrollbarWidth: 'none' }}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className="px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all flex-shrink-0"
            style={{
              background: activeCategory === cat ? 'linear-gradient(135deg, #6B0F0F, #4A0A0A)' : '#fff',
              color: activeCategory === cat ? '#fff' : '#6B7280',
              border: '1px solid',
              borderColor: activeCategory === cat ? 'transparent' : 'rgba(107,15,15,0.12)',
              boxShadow: activeCategory === cat ? '0 4px 12px rgba(107,15,15,0.15)' : 'none',
              fontFamily: 'var(--font-heading)',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Results Count */}
      <div className="px-4 mb-4 flex items-center justify-between">
        <p style={{ color: '#6B7280', fontSize: '13px' }}>
          Found <span style={{ color: '#6B0F0F', fontWeight: 700 }}>{filtered.length}</span> items
        </p>
      </div>

      {/* Menu Grid */}
      <div className="px-4 pb-32 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
        {filtered.length === 0 ? (
          <div className="col-span-full text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
            <div className="text-4xl mb-4">🔍</div>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: 700, color: '#111' }}>No dishes found</h3>
            <p style={{ color: '#6B7280', fontSize: '13px', marginTop: '4px' }}>Try adjusting your filters</p>
          </div>
        ) : (
          filtered.map(item => {
            const inCart = cart.find(c => c.item.id === item.id);
            return (
              <div
                key={item.id}
                onClick={() => setSelectedItemSlug(item.slug)}
                className="bg-white rounded-2xl overflow-hidden shadow-sm card-hover group cursor-pointer"
                style={{ border: '1px solid rgba(107,15,15,0.06)' }}
              >
                <div className="relative overflow-hidden" style={{ height: 'clamp(110px, 30vw, 160px)' }}>
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {item.isPopular && (
                      <span className="premium-badge" style={{ fontSize: '8px', padding: '1px 5px' }}>Popular</span>
                    )}
                    {item.isVeg && (
                      <span className="px-1.5 py-0.5 rounded-full text-white" style={{ backgroundColor: '#16A34A', fontSize: '8px', fontWeight: 700 }}>Veg</span>
                    )}
                  </div>
                  <div
                    className="absolute top-2 right-2 px-1.5 py-0.5 rounded-full"
                    style={{
                      backgroundColor: `${spiceColors[item.spiceLevel] || '#6B7280'}20`,
                      color: spiceColors[item.spiceLevel] || '#6B7280',
                      border: `1px solid ${spiceColors[item.spiceLevel] || '#6B7280'}40`,
                      fontSize: '9px',
                      fontWeight: 700,
                      backdropFilter: 'blur(4px)'
                    }}
                  >
                    {item.spiceLevel}
                  </div>
                  <div className="absolute inset-x-0 bottom-2 flex justify-center opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 duration-300">
                    <span
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-white text-[10px] font-bold"
                      style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.4)' }}
                    >
                      <Eye size={10} /> Details
                    </span>
                  </div>
                </div>

                <div className="p-3">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="flex-1 pr-1 line-clamp-1" style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '13px', color: '#111' }}>
                      {item.name}
                    </h3>
                    <span style={{ fontWeight: 800, fontSize: '13px', color: '#6B0F0F', fontFamily: 'var(--font-heading)' }}>
                      ৳{item.price}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 mb-3">
                    <StarRating rating={item.rating} size={10} />
                    <span style={{ fontSize: '10px', color: '#9CA3AF' }}>({item.rating})</span>
                  </div>

                  <div className="flex gap-1.5">
                    <button
                      onClick={e => { e.stopPropagation(); setSelectedItemSlug(item.slug); }}
                      className="flex-1 py-1.5 rounded-lg font-bold border transition-all flex items-center justify-center gap-1"
                      style={{ borderColor: '#6B0F0F', color: '#6B0F0F', fontSize: '10px', fontFamily: 'var(--font-heading)' }}
                    >
                      <Eye size={10} /> <span className="xs:inline hidden">Details</span>
                    </button>
                    <button
                      onClick={e => { e.stopPropagation(); addToLocalCart(item); }}
                      className="flex-1 py-1.5 rounded-lg font-bold text-white transition-all flex items-center justify-center gap-1"
                      style={{ background: inCart ? '#16A34A' : 'linear-gradient(135deg, #6B0F0F, #4A0A0A)', fontSize: '10px', fontFamily: 'var(--font-heading)' }}
                    >
                      {inCart ? <CheckCircle size={10} /> : <Plus size={10} />}
                      <span>{inCart ? ( <><span className="xs:inline hidden">Added</span>({inCart.quantity})</> ) : 'Add'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Place Order FAB */}
      {cartCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4" style={{ background: 'linear-gradient(to top, rgba(249,245,240,1) 60%, rgba(249,245,240,0))' }}>
          <button
            onClick={() => setCartOpen(true)}
            className="w-full py-4 rounded-2xl text-white font-bold flex items-center justify-between px-5 transition-all active:scale-98 shadow-2xl"
            style={{ background: 'linear-gradient(135deg, #6B0F0F, #4A0A0A)', fontFamily: 'var(--font-heading)', fontSize: '15px' }}
          >
            <span className="flex items-center gap-2">
              <ShoppingCart size={18} />
              View Cart ({cartCount} items)
            </span>
            <span style={{ color: '#D4AF37', fontWeight: 900 }}>৳{cartTotal}</span>
          </button>
        </div>
      )}

      {/* Cart Drawer */}
      {cartOpen && (
        <div
          className="fixed inset-0 z-50 flex flex-col justify-end"
          style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
          onClick={e => { if (e.target === e.currentTarget) setCartOpen(false); }}
        >
          <div className="bg-white rounded-t-3xl max-h-[85vh] flex flex-col" style={{ boxShadow: '0 -20px 60px rgba(0,0,0,0.3)' }}>
            {/* Drawer header */}
            <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid rgba(107,15,15,0.08)' }}>
              <div>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '18px', color: '#111' }}>Your Order</h2>
                <p style={{ fontSize: '12px', color: '#6B7280' }}>Table {table.tableNumber} — {table.area}</p>
              </div>
              <button onClick={() => setCartOpen(false)} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#F3F4F6' }}>
                <X size={16} style={{ color: '#374151' }} />
              </button>
            </div>

            {/* Cart items */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {cart.map(c => (
                <div key={c.item.id} className="flex items-start gap-3">
                  <img src={c.item.image} alt={c.item.name} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '14px', color: '#111' }}>{c.item.name}</p>
                        {c.note && <p style={{ fontSize: '11px', color: '#6B7280', marginTop: '2px' }}>Note: {c.note}</p>}
                      </div>
                      <button onClick={() => updateQty(c.item.id, 0)}>
                        <Trash2 size={14} style={{ color: '#9CA3AF' }} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2">
                        <button onClick={() => updateQty(c.item.id, c.quantity - 1)} className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #6B0F0F, #4A0A0A)' }}>
                          <Minus size={11} style={{ color: '#fff' }} />
                        </button>
                        <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '14px', color: '#111', minWidth: '20px', textAlign: 'center' }}>{c.quantity}</span>
                        <button onClick={() => updateQty(c.item.id, c.quantity + 1)} className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #6B0F0F, #4A0A0A)' }}>
                          <Plus size={11} style={{ color: '#fff' }} />
                        </button>
                      </div>
                      <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '15px', color: '#6B0F0F' }}>৳{c.item.price * c.quantity}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Special note */}
            <div className="px-5 pb-3">
              <label style={{ fontFamily: 'var(--font-heading)', fontSize: '12px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Special Instructions (Optional)
              </label>
              <textarea
                rows={2}
                value={customerNote}
                onChange={e => setCustomerNote(e.target.value)}
                placeholder="Any special requests for the whole order..."
                className="w-full px-3.5 py-2.5 rounded-xl border text-sm"
                style={{ borderColor: 'rgba(107,15,15,0.15)', fontFamily: 'var(--font-body)', outline: 'none', resize: 'none' }}
              />
            </div>

            {/* Footer */}
            <div className="px-5 pb-6 pt-3" style={{ borderTop: '1px solid rgba(107,15,15,0.08)' }}>
              <div className="flex items-center justify-between mb-4">
                <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '15px', color: '#374151' }}>Total</span>
                <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '22px', color: '#6B0F0F' }}>৳{cartTotal}</span>
              </div>
              <button
                onClick={handlePlaceOrder}
                className="w-full py-4 rounded-2xl text-white font-bold flex items-center justify-center gap-3 transition-all active:scale-98 shadow-2xl"
                style={{ background: 'linear-gradient(135deg, #6B0F0F, #4A0A0A)', fontFamily: 'var(--font-heading)', fontSize: '16px' }}
              >
                <CheckCircle size={20} />
                Place Order
              </button>
              <p className="text-center mt-3" style={{ fontSize: '11px', color: '#9CA3AF', fontFamily: 'var(--font-body)' }}>
                Staff will collect payment at the table
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Item Detail Overlay */}
      {selectedItemSlug && (() => {
        const item = state.menuItems.find(m => m.slug === selectedItemSlug);
        if (!item) return null;
        const inCart = cart.find(c => c.item.id === item.id);
        return (
          <DishDetailOverlay
            item={item}
            inCartQuantity={inCart?.quantity || 0}
            onClose={() => setSelectedItemSlug(null)}
            onAdd={(item, qty, note) => {
              setCart(prev => {
                const ex = prev.find(c => c.item.id === item.id);
                if (ex) return prev.map(c => c.item.id === item.id ? { ...c, quantity: qty, note } : c);
                return [...prev, {
                  item: { id: item.id, name: item.name, price: item.price, image: item.image, category: item.category, description: item.description, rating: item.rating, spiceLevel: item.spiceLevel, isVeg: item.isVeg },
                  quantity: qty,
                  note: note || '',
                }];
              });
            }}
            updateQty={updateQty}
          />
        );
      })()}
    </div>
  );
}