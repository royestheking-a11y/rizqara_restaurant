import { useState, useEffect } from 'react';
import {
  ChefHat, Clock, Bell, CheckCircle, Utensils, RefreshCw, Monitor,
  CookingPot, Receipt, Zap, StickyNote, Wifi, WifiOff,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TableOrderStatus } from '../context/AppContext';

const statusColors: Record<string, { bg: string; border: string; text: string; badge: string; badgeText: string }> = {
  Pending:   { bg: '#FFFBF5', border: '#FDE68A', text: '#92400E', badge: '#F59E0B', badgeText: '#fff' },
  Confirmed: { bg: '#F5F3FF', border: '#C4B5FD', text: '#5B21B6', badge: '#7C3AED', badgeText: '#fff' },
  Cooking:   { bg: '#FFF7ED', border: '#FED7AA', text: '#9A3412', badge: '#EA580C', badgeText: '#fff' },
  Ready:     { bg: '#F0FDF4', border: '#4ADE80', text: '#15803D', badge: '#16A34A', badgeText: '#fff' },
};

const activeStatuses: TableOrderStatus[] = ['Pending', 'Confirmed', 'Cooking', 'Ready'];

const statusMeta: Record<string, { Icon: typeof ChefHat; label: string; color: string; nextLabel: string; nextIcon: typeof ChefHat }> = {
  Pending:   { Icon: Clock,       label: 'Pending',   color: '#F59E0B', nextLabel: 'Confirm Order',  nextIcon: Zap },
  Confirmed: { Icon: CheckCircle, label: 'Confirmed', color: '#7C3AED', nextLabel: 'Start Cooking',  nextIcon: CookingPot },
  Cooking:   { Icon: CookingPot,  label: 'Cooking',   color: '#EA580C', nextLabel: 'Mark Ready',     nextIcon: Bell },
  Ready:     { Icon: Bell,        label: 'Ready',     color: '#16A34A', nextLabel: 'Mark Served',    nextIcon: ChefHat },
};

function ElapsedTimer({ since }: { since: number }) {
  const [elapsed, setElapsed] = useState(Math.floor((Date.now() - since) / 1000));
  useEffect(() => {
    const id = setInterval(() => setElapsed(Math.floor((Date.now() - since) / 1000)), 1000);
    return () => clearInterval(id);
  }, [since]);
  const m = Math.floor(elapsed / 60);
  const s = elapsed % 60;
  const isLate = m >= 20;
  return (
    <span style={{ color: isLate ? '#EF4444' : undefined, fontWeight: isLate ? 700 : undefined }}>
      {m}:{String(s).padStart(2, '0')}
    </span>
  );
}

export function KitchenDisplay() {
  const { state, updateTableOrderStatus } = useApp();
  const [filterStatus, setFilterStatus] = useState<'All' | TableOrderStatus>('All');
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [isLive, setIsLive] = useState(true);

  // Auto-refresh every 5 seconds (the AppContext storage listener handles cross-tab updates)
  useEffect(() => {
    const id = setInterval(() => {
      setLastRefresh(new Date());
    }, 5000);
    return () => clearInterval(id);
  }, []);

  // Blink the live indicator
  useEffect(() => {
    const id = setInterval(() => setIsLive(v => !v), 1500);
    return () => clearInterval(id);
  }, []);

  const orders = (state.tableOrders ?? [])
    .filter(o => activeStatuses.includes(o.status))
    .filter(o => filterStatus === 'All' || o.status === filterStatus)
    .sort((a, b) => a.createdAt - b.createdAt); // oldest first

  const tableOrders = state.tableOrders ?? [];
  const counts = {
    Pending:   tableOrders.filter(o => o.status === 'Pending').length,
    Confirmed: tableOrders.filter(o => o.status === 'Confirmed').length,
    Cooking:   tableOrders.filter(o => o.status === 'Cooking').length,
    Ready:     tableOrders.filter(o => o.status === 'Ready').length,
  };

  const nextStatus: Partial<Record<TableOrderStatus, TableOrderStatus>> = {
    Pending:   'Confirmed',
    Confirmed: 'Cooking',
    Cooking:   'Ready',
    Ready:     'Served',
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0A0A0A' }}>
      {/* Header */}
      <div
        className="sticky top-0 z-10 px-4 sm:px-6 py-4"
        style={{ background: 'linear-gradient(135deg, #1A0000, #2D0000)', borderBottom: '1px solid rgba(212,175,55,0.15)' }}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, #D4AF37, #B8960C)' }}>
              <ChefHat size={20} style={{ color: '#1A0000' }} />
            </div>
            <div className="min-w-0">
              <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '18px', color: '#fff', lineHeight: 1 }}>
                Kitchen Display
              </h1>
              <p style={{ color: '#D4AF37', fontSize: '11px', fontFamily: 'var(--font-heading)', fontWeight: 600, letterSpacing: '1px' }}>
                Rizqara Restaurant
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Live indicator */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <div className="flex items-center gap-1.5">
                {isLive ? (
                  <Wifi size={12} style={{ color: '#16A34A' }} />
                ) : (
                  <WifiOff size={12} style={{ color: '#6B7280' }} />
                )}
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: isLive ? '#16A34A' : '#6B7280', transition: 'background-color 0.3s' }} />
              </div>
              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', fontFamily: 'var(--font-heading)' }}>
                {lastRefresh.toLocaleTimeString()}
              </span>
            </div>

            {/* Manual refresh */}
            <button
              onClick={() => setLastRefresh(new Date())}
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:rotate-180"
              style={{ background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.2)', transition: 'all 0.3s' }}
            >
              <RefreshCw size={15} style={{ color: '#D4AF37' }} />
            </button>

            {/* Screen mode hint */}
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <Monitor size={12} style={{ color: 'rgba(255,255,255,0.3)' }} />
              <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '10px', fontFamily: 'var(--font-heading)' }}>Kitchen Screen</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Bar / Filter */}
      <div className="px-4 sm:px-6 py-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
        {(['Pending', 'Confirmed', 'Cooking', 'Ready'] as const).map(status => {
          const meta = statusMeta[status];
          const count = counts[status];
          const isActive = filterStatus === status;
          return (
            <button
              key={status}
              onClick={() => setFilterStatus(filterStatus === status ? 'All' : status)}
              className="flex items-center gap-3 p-3 sm:p-4 rounded-2xl transition-all"
              style={{
                background: isActive ? `${meta.color}20` : 'rgba(255,255,255,0.04)',
                border: `1px solid ${isActive ? `${meta.color}50` : 'rgba(255,255,255,0.08)'}`,
                boxShadow: isActive ? `0 0 20px ${meta.color}15` : 'none',
              }}
            >
              <div
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${meta.color}20` }}
              >
                <meta.Icon size={17} style={{ color: meta.color }} />
              </div>
              <div>
                <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '22px', color: meta.color, lineHeight: 1 }}>{count}</p>
                <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-heading)', fontWeight: 600, marginTop: '2px' }}>{status}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Orders Grid */}
      <div className="px-4 sm:px-6 pb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {orders.map(order => {
          const cfg = statusColors[order.status] || statusColors.Pending;
          const meta = statusMeta[order.status];
          const next = nextStatus[order.status];
          const minutesOld = Math.floor((Date.now() - order.createdAt) / 60000);
          const isUrgent = minutesOld >= 15;
          const NextIcon = meta?.nextIcon || ChefHat;

          return (
            <div
              key={order.id}
              className="rounded-2xl overflow-hidden flex flex-col"
              style={{
                backgroundColor: cfg.bg,
                border: `2px solid ${isUrgent ? '#EF4444' : cfg.border}`,
                boxShadow: isUrgent
                  ? '0 0 24px rgba(239,68,68,0.35)'
                  : '0 4px 20px rgba(0,0,0,0.25)',
                transition: 'box-shadow 0.3s',
              }}
            >
              {/* Urgent banner */}
              {isUrgent && (
                <div className="px-4 py-1.5 flex items-center gap-2" style={{ backgroundColor: '#EF4444' }}>
                  <Zap size={11} style={{ color: '#fff' }} />
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#fff', fontFamily: 'var(--font-heading)', letterSpacing: '0.5px' }}>
                    URGENT — {minutesOld}min waiting
                  </span>
                </div>
              )}

              {/* Card header */}
              <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: `1px solid ${cfg.border}` }}>
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #6B0F0F, #4A0A0A)' }}
                  >
                    <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '12px', color: '#D4AF37' }}>
                      {order.tableNumber}
                    </span>
                  </div>
                  <div>
                    <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '15px', color: '#111' }}>
                      Table {order.tableNumber}
                    </p>
                    <p style={{ fontSize: '11px', color: '#6B7280' }}>
                      {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="flex items-center gap-1.5 justify-end mb-1">
                    <div
                      className="px-2.5 py-1 rounded-full flex items-center gap-1"
                      style={{ backgroundColor: cfg.badge }}
                    >
                      {meta && <meta.Icon size={10} style={{ color: cfg.badgeText }} />}
                      <span style={{ fontSize: '11px', fontWeight: 700, color: cfg.badgeText, fontFamily: 'var(--font-heading)' }}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 justify-end">
                    <Clock size={10} style={{ color: isUrgent ? '#EF4444' : '#9CA3AF' }} />
                    <span style={{ fontSize: '11px', color: isUrgent ? '#EF4444' : '#9CA3AF', fontFamily: 'var(--font-heading)', fontWeight: 600 }}>
                      <ElapsedTimer since={order.createdAt} />
                    </span>
                  </div>
                </div>
              </div>

              {/* Items */}
              <div className="flex-1 px-4 py-3 space-y-2.5">
                {order.items.map(item => (
                  <div key={item.itemId} className="flex items-start gap-2.5">
                    <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <p className="truncate" style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '13px', color: '#111', lineHeight: 1.3 }}>
                          {item.name}
                        </p>
                        <span
                          className="flex-shrink-0 px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: 'rgba(107,15,15,0.1)', color: '#6B0F0F', fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '12px' }}
                        >
                          ×{item.quantity}
                        </span>
                      </div>
                      {item.note && (
                        <p className="flex items-center gap-1 mt-0.5 truncate" style={{ fontSize: '10px', color: '#6B7280' }}>
                          <StickyNote size={9} /> {item.note}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
                {order.customerNote && (
                  <div className="flex items-start gap-2 mt-1 px-3 py-2 rounded-xl" style={{ backgroundColor: 'rgba(107,15,15,0.06)', border: '1px solid rgba(107,15,15,0.1)' }}>
                    <StickyNote size={12} style={{ color: '#6B0F0F', flexShrink: 0, marginTop: '1px' }} />
                    <p style={{ fontSize: '11px', color: '#6B0F0F', fontFamily: 'var(--font-body)', lineHeight: 1.4 }}>
                      {order.customerNote}
                    </p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-4 py-3 space-y-2" style={{ borderTop: `1px solid ${cfg.border}` }}>
                <div className="flex items-center justify-between mb-1">
                  <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '12px', color: '#374151' }}>Total</span>
                  <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '16px', color: '#6B0F0F' }}>৳{order.total}</span>
                </div>

                {next && (
                  <button
                    onClick={() => updateTableOrderStatus(order.id, next)}
                    className="w-full py-2.5 rounded-xl font-semibold text-white transition-all active:scale-95 hover:opacity-90 flex items-center justify-center gap-2"
                    style={{
                      background:
                        order.status === 'Pending'   ? 'linear-gradient(135deg, #16A34A, #15803D)' :
                        order.status === 'Confirmed' ? 'linear-gradient(135deg, #EA580C, #C2410C)' :
                        order.status === 'Cooking'   ? 'linear-gradient(135deg, #7C3AED, #6D28D9)' :
                                                       'linear-gradient(135deg, #6B0F0F, #4A0A0A)',
                      fontFamily: 'var(--font-heading)',
                      fontSize: '13px',
                    }}
                  >
                    <NextIcon size={14} />
                    {meta?.nextLabel}
                  </button>
                )}

                {order.status === 'Ready' && (
                  <button
                    onClick={() => updateTableOrderStatus(order.id, 'Paid')}
                    className="w-full py-2 rounded-xl font-semibold transition-all active:scale-95 flex items-center justify-center gap-2"
                    style={{ backgroundColor: '#F3F4F6', color: '#6B7280', fontFamily: 'var(--font-heading)', fontSize: '12px' }}
                  >
                    <Receipt size={12} /> Mark Paid
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty state */}
      {orders.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 px-6">
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center mb-6"
            style={{ background: 'rgba(212,175,55,0.08)', border: '2px solid rgba(212,175,55,0.15)' }}
          >
            <Utensils size={40} style={{ color: 'rgba(212,175,55,0.4)' }} />
          </div>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '20px', color: 'rgba(255,255,255,0.35)', marginBottom: '8px' }}>
            {filterStatus === 'All' ? 'No active orders' : `No ${filterStatus} orders`}
          </h3>
          <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '14px', textAlign: 'center', maxWidth: '300px' }}>
            {filterStatus !== 'All'
              ? 'Try selecting "All" to see orders in other stages.'
              : 'Orders placed from QR-scanned tables will appear here in real-time.'}
          </p>
          <div className="flex items-center gap-2 mt-6 px-4 py-2.5 rounded-xl" style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.15)' }}>
            <Wifi size={14} style={{ color: '#D4AF37' }} />
            <span style={{ color: 'rgba(212,175,55,0.7)', fontSize: '12px', fontFamily: 'var(--font-heading)', fontWeight: 600 }}>
              Live sync active — updates appear automatically
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
