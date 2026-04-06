import React, { useState, useEffect } from 'react';
import {
  Plus, X, Save, Trash2, QrCode, Download, Users, Clock, CheckCircle,
  ChefHat, Bell, Utensils, DollarSign, RefreshCw, ExternalLink, Eye,
  FileText, Printer, Crown, Leaf, CookingPot, CircleDot,
  Receipt, StickyNote, TableProperties, Wifi, ArrowRight, Zap,
} from 'lucide-react';
import { useApp, RestaurantTable, TableArea, TableStatus, TableOrderStatus } from '../../context/AppContext';

// ─── Status Config ────────────────────────────────────────────────────────────
const statusConfig: Record<TableStatus, { label: string; bg: string; text: string; border: string; dot: string; icon: typeof CircleDot }> = {
  Available: { label: 'Available', bg: '#DCFCE7', text: '#166534', border: '#86EFAC', dot: '#16A34A', icon: CheckCircle },
  Ordering:  { label: 'Ordering',  bg: '#FEF3C7', text: '#92400E', border: '#FDE68A', dot: '#F59E0B', icon: Utensils },
  Cooking:   { label: 'Cooking',   bg: '#DBEAFE', text: '#1E40AF', border: '#93C5FD', dot: '#2563EB', icon: CookingPot },
  Ready:     { label: 'Ready',     bg: '#EDE9FE', text: '#5B21B6', border: '#C4B5FD', dot: '#7C3AED', icon: Bell },
  Served:    { label: 'Served',    bg: '#FEE2E2', text: '#991B1B', border: '#FCA5A5', dot: '#DC2626', icon: ChefHat },
  Paid:      { label: 'Paid',      bg: '#F3F4F6', text: '#374151', border: '#D1D5DB', dot: '#9CA3AF', icon: Receipt },
};

const areas: TableArea[] = ['Dining', 'VIP', 'Outdoor'];

const areaConfig: Record<TableArea, { color: string; bg: string; borderColor: string; Icon: typeof Utensils; label: string }> = {
  Dining:  { color: '#6B0F0F', bg: '#FFF5F5', borderColor: 'rgba(107,15,15,0.12)', Icon: Utensils,  label: 'Dining Area' },
  VIP:     { color: '#6D28D9', bg: '#F5F3FF', borderColor: 'rgba(109,40,217,0.12)', Icon: Crown,     label: 'VIP Area' },
  Outdoor: { color: '#059669', bg: '#F0FDF4', borderColor: 'rgba(5,150,105,0.12)',  Icon: Leaf,      label: 'Outdoor Area' },
};

const orderStatusNext: Partial<Record<TableOrderStatus, TableOrderStatus>> = {
  Pending: 'Confirmed', Confirmed: 'Cooking', Cooking: 'Ready', Ready: 'Served', Served: 'Paid',
};
const orderStatusLabel: Partial<Record<TableOrderStatus, string>> = {
  Pending: 'Confirm Order', Confirmed: 'Start Cooking', Cooking: 'Mark Ready', Ready: 'Mark Served', Served: 'Mark Paid',
};
const orderStatusIcon: Partial<Record<TableOrderStatus, typeof CheckCircle>> = {
  Pending: Zap, Confirmed: CookingPot, Cooking: Bell, Ready: ChefHat, Served: Receipt,
};

function ElapsedTime({ since }: { since: number }) {
  const [elapsed, setElapsed] = useState(Math.floor((Date.now() - since) / 1000));
  useEffect(() => {
    const id = setInterval(() => setElapsed(Math.floor((Date.now() - since) / 1000)), 1000);
    return () => clearInterval(id);
  }, [since]);
  const m = Math.floor(elapsed / 60);
  const s = elapsed % 60;
  return <span style={{ color: m >= 20 ? '#DC2626' : undefined, fontWeight: m >= 20 ? 700 : undefined }}>{m}m {String(s).padStart(2, '0')}s</span>;
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 14px', borderRadius: '10px',
  border: '1.5px solid rgba(107,15,15,0.18)', fontSize: '13px',
  fontFamily: 'var(--font-body)', outline: 'none', color: '#111', backgroundColor: '#fff',
};
const labelStyle: React.CSSProperties = {
  fontFamily: 'var(--font-heading)', fontSize: '12px', fontWeight: 600, color: '#374151',
  display: 'block', marginBottom: '5px', textTransform: 'uppercase' as const, letterSpacing: '0.5px',
};

// ─── Add/Edit Table Modal ─────────────────────────────────────────────────────
function TableModal({
  title, form, setForm, onSave, onClose,
}: {
  title: string;
  form: { tableNumber: string; seats: string; area: TableArea };
  setForm: React.Dispatch<React.SetStateAction<{ tableNumber: string; seats: string; area: TableArea }>>;
  onSave: () => void;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: 'rgba(107,15,15,0.12)' }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #6B0F0F, #4A0A0A)' }}>
              <TableProperties size={16} className="text-white" />
            </div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '17px', color: '#111' }}>{title}</h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors">
            <X size={16} style={{ color: '#6B7280' }} />
          </button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label style={labelStyle}>Table Number *</label>
            <input
              type="text" value={form.tableNumber}
              onChange={e => setForm(f => ({ ...f, tableNumber: e.target.value.toUpperCase() }))}
              placeholder="e.g. T07, V03, O03" style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>Seats *</label>
            <input
              type="number" min={1} max={20} value={form.seats}
              onChange={e => setForm(f => ({ ...f, seats: e.target.value }))}
              placeholder="Number of seats" style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>Area *</label>
            <div className="grid grid-cols-3 gap-2">
              {areas.map(a => {
                const cfg = areaConfig[a];
                const isActive = form.area === a;
                return (
                  <button
                    key={a}
                    type="button"
                    onClick={() => setForm(f => ({ ...f, area: a }))}
                    className="flex flex-col items-center gap-2 py-3 rounded-xl transition-all"
                    style={{
                      backgroundColor: isActive ? cfg.bg : '#F9FAFB',
                      border: `2px solid ${isActive ? cfg.color : '#E5E7EB'}`,
                    }}
                  >
                    <cfg.Icon size={16} style={{ color: isActive ? cfg.color : '#9CA3AF' }} />
                    <span style={{ fontSize: '11px', fontWeight: 700, color: isActive ? cfg.color : '#9CA3AF', fontFamily: 'var(--font-heading)' }}>{a}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        <div className="flex gap-3 p-5 border-t" style={{ borderColor: 'rgba(107,15,15,0.08)' }}>
          <button onClick={onClose} className="flex-1 py-3 rounded-xl text-sm font-semibold hover:bg-gray-100 transition-all" style={{ border: '1.5px solid rgba(107,15,15,0.15)', color: '#374151', fontFamily: 'var(--font-heading)' }}>
            Cancel
          </button>
          <button onClick={onSave} className="flex-1 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:shadow-lg hover:-translate-y-0.5" style={{ background: 'linear-gradient(135deg, #6B0F0F, #4A0A0A)', fontFamily: 'var(--font-heading)' }}>
            <Save size={14} className="inline mr-2" /> Save Table
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── QR Modal ─────────────────────────────────────────────────────────────────
function QRModal({ table, onClose }: { table: RestaurantTable; onClose: () => void }) {
  const tableUrl = `${window.location.origin}/table/${table.id}`;
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=280x280&margin=10&data=${encodeURIComponent(tableUrl)}`;

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = qrSrc;
    a.download = `QR-Table-${table.tableNumber}.png`;
    a.target = '_blank';
    a.click();
  };

  const areaCfg = areaConfig[table.area];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5" style={{ background: 'linear-gradient(135deg, #1A0000, #4A0A0A)' }}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(212,175,55,0.2)', border: '1px solid rgba(212,175,55,0.3)' }}>
                <QrCode size={16} style={{ color: '#D4AF37' }} />
              </div>
              <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '15px', color: '#fff' }}>QR Code</span>
            </div>
            <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.1)' }}>
              <X size={14} style={{ color: 'rgba(255,255,255,0.7)' }} />
            </button>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #D4AF37, #B8960C)' }}>
              <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '13px', color: '#1A0000' }}>{table.tableNumber}</span>
            </div>
            <div>
              <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '20px', color: '#D4AF37', lineHeight: 1 }}>Table {table.tableNumber}</p>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', marginTop: '2px' }}>
                <areaCfg.Icon size={10} style={{ display: 'inline', marginRight: '4px' }} />
                {table.area} Area · {table.seats} Seats
              </p>
            </div>
          </div>
        </div>

        {/* QR Code */}
        <div className="flex flex-col items-center px-6 py-6">
          <div className="p-3 rounded-2xl shadow-lg mb-4" style={{ border: '3px solid #6B0F0F' }}>
            <img src={qrSrc} alt={`QR for Table ${table.tableNumber}`} className="w-56 h-56" />
          </div>
          <div className="flex items-center gap-2 mb-3">
            <Wifi size={13} style={{ color: '#16A34A' }} />
            <p style={{ fontSize: '12px', color: '#16A34A', fontFamily: 'var(--font-heading)', fontWeight: 600 }}>
              Scan to place order instantly
            </p>
          </div>
          <p className="text-center px-3 py-2 rounded-xl break-all w-full" style={{ fontSize: '10px', color: '#6B0F0F', backgroundColor: '#FFF5F5', fontFamily: 'monospace', border: '1px solid rgba(107,15,15,0.15)' }}>
            {tableUrl}
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 px-6 pb-6">
          <button
            onClick={() => window.open(tableUrl, '_blank')}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all hover:shadow-md"
            style={{ border: '1.5px solid rgba(107,15,15,0.2)', color: '#6B0F0F', fontFamily: 'var(--font-heading)' }}
          >
            <ExternalLink size={14} /> Preview
          </button>
          <button
            onClick={handleDownload}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:shadow-lg hover:-translate-y-0.5"
            style={{ background: 'linear-gradient(135deg, #6B0F0F, #4A0A0A)', fontFamily: 'var(--font-heading)' }}
          >
            <Download size={14} /> Download
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Invoice Modal ─────────────────────────────────────────────────────────────
function InvoiceModal({ orderId, onClose }: { orderId: string; onClose: () => void }) {
  const { state } = useApp();
  const order = (state.tableOrders ?? []).find(o => o.id === orderId);
  if (!order) return null;
  const date = new Date(order.createdAt);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="px-6 py-5" style={{ background: 'linear-gradient(135deg, #1A0000, #4A0A0A)' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Receipt size={16} style={{ color: '#D4AF37' }} />
              <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '16px', color: '#fff' }}>Invoice</span>
            </div>
            <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.1)' }}>
              <X size={14} style={{ color: 'rgba(255,255,255,0.7)' }} />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Invoice header */}
          <div className="text-center mb-5 pb-5" style={{ borderBottom: '2px dashed rgba(107,15,15,0.15)' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '18px', color: '#111' }}>Rizqara Restaurant</h2>
            <p style={{ fontSize: '12px', color: '#6B7280', marginTop: '4px' }}>Dhaka, Bangladesh</p>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
            {[
              { label: 'Invoice ID', value: (order.id || '').split('-')[1] || (order.id || '').slice(-6) },
              { label: 'Table', value: `Table ${order.tableNumber}` },
              { label: 'Date', value: date.toLocaleDateString() },
              { label: 'Time', value: date.toLocaleTimeString() },
            ].map(({ label, value }) => (
              <div key={label}>
                <p style={{ color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.5px', fontFamily: 'var(--font-heading)', marginBottom: '2px' }}>{label}</p>
                <p style={{ fontWeight: 700, color: '#111', fontFamily: 'var(--font-heading)' }}>{value}</p>
              </div>
            ))}
          </div>

          {/* Items */}
          <div className="space-y-2 mb-4">
            {order.items.map(item => (
              <div key={item.itemId} className="flex items-center justify-between text-sm">
                <div>
                  <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, color: '#111' }}>{item.name}</span>
                  <span style={{ color: '#9CA3AF', marginLeft: '6px' }}>×{item.quantity}</span>
                </div>
                <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, color: '#6B0F0F' }}>৳{item.price * item.quantity}</span>
              </div>
            ))}
          </div>

          <div className="pt-3 mb-5" style={{ borderTop: '2px dashed rgba(107,15,15,0.15)' }}>
            <div className="flex items-center justify-between">
              <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '15px', color: '#374151' }}>Total</span>
              <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '22px', color: '#6B0F0F' }}>৳{order.total}</span>
            </div>
            <div className="mt-2 flex items-center gap-2 justify-end">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: order.status === 'Paid' ? '#16A34A' : '#F59E0B' }} />
              <span style={{ fontSize: '12px', color: '#6B7280', fontFamily: 'var(--font-heading)', fontWeight: 600 }}>
                {order.status === 'Paid' ? 'Paid' : 'Payment Pending'}
              </span>
            </div>
          </div>

          <button
            onClick={() => window.print()}
            className="w-full py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold text-white transition-all hover:shadow-lg"
            style={{ background: 'linear-gradient(135deg, #6B0F0F, #4A0A0A)', fontFamily: 'var(--font-heading)' }}
          >
            <Printer size={15} /> Print Invoice
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Table Card ───────────────────────────────────────────────────────────────
function TableCard({
  table, isSelected, onClick,
}: {
  table: RestaurantTable;
  isSelected: boolean;
  onClick: () => void;
}) {
  const cfg = statusConfig[table.status];
  const StatusIcon = cfg.icon;
  const currentOrder = (useApp().state.tableOrders ?? []).find(
    o => o.id === table.currentOrderId && !['Paid'].includes(o.status)
  );

  return (
    <button
      onClick={onClick}
      className="relative p-3.5 rounded-2xl transition-all text-left w-full"
      style={{
        backgroundColor: cfg.bg,
        border: `2px solid ${isSelected ? '#6B0F0F' : cfg.border}`,
        boxShadow: isSelected ? '0 0 0 3px rgba(107,15,15,0.2), 0 4px 16px rgba(0,0,0,0.12)' : '0 2px 8px rgba(0,0,0,0.06)',
        transform: isSelected ? 'scale(1.02)' : 'scale(1)',
        transition: 'all 0.2s ease',
      }}
    >
      {/* Status dot */}
      <div className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cfg.dot, boxShadow: `0 0 6px ${cfg.dot}80` }} />

      <div className="flex items-start gap-2.5 mb-2.5">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #6B0F0F, #4A0A0A)' }}
        >
          <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '11px', color: '#D4AF37' }}>
            {table.tableNumber}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="truncate" style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '13px', color: '#111', lineHeight: 1.2 }}>
            Table {table.tableNumber}
          </p>
          <p className="flex items-center gap-1 mt-0.5" style={{ fontSize: '10px', color: '#6B7280' }}>
            <Users size={9} /> {table.seats} seats
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 mb-2">
        <StatusIcon size={10} style={{ color: cfg.dot }} />
        <span style={{ fontSize: '11px', fontWeight: 700, color: cfg.text, fontFamily: 'var(--font-heading)' }}>{cfg.label}</span>
      </div>

      {currentOrder && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <DollarSign size={10} style={{ color: '#6B0F0F' }} />
            <span style={{ fontSize: '11px', fontFamily: 'var(--font-heading)', fontWeight: 700, color: '#6B0F0F' }}>
              ৳{currentOrder.total}
            </span>
          </div>
          {table.occupiedSince && (
            <div className="flex items-center gap-1">
              <Clock size={9} style={{ color: '#9CA3AF' }} />
              <span style={{ fontSize: '10px', color: '#9CA3AF', fontFamily: 'var(--font-heading)' }}>
                <ElapsedTime since={table.occupiedSince} />
              </span>
            </div>
          )}
        </div>
      )}
    </button>
  );
}

// ─── Order Detail Panel ───────────────────────────────────────────────────────
function TableDetailPanel({
  table,
  onClose,
  isDrawer,
}: {
  table: RestaurantTable;
  onClose: () => void;
  isDrawer?: boolean;
}) {
  const { state, updateTableOrderStatus, setTableStatus, dispatch, showNotification } = useApp();
  const tableOrders = state.tableOrders ?? [];

  const selectedOrder = table.currentOrderId
    ? tableOrders.find(o => o.id === table.currentOrderId && o.status !== 'Paid')
    : null;

  const [showQR, setShowQR] = useState(false);
  const [showInvoice, setShowInvoice] = useState<string | null>(null);

  const handleResetTable = () => {
    setTableStatus(table.id, 'Available', undefined);
    showNotification('Table reset to Available.', 'success');
  };

  const handleDeleteTable = () => {
    if (window.confirm('Delete this table?')) {
      dispatch({ type: 'DELETE_TABLE', payload: table.id });
      showNotification('Table deleted.', 'info');
      onClose();
    }
  };

  const cfg = statusConfig[table.status];
  const StatusIcon = cfg.icon;
  const areaCfg = areaConfig[table.area];

  const panelContent = (
    <>
      {/* Panel header */}
      <div className="p-5" style={{ background: 'linear-gradient(135deg, #1A0000, #4A0A0A)', borderRadius: isDrawer ? '20px 20px 0 0' : '16px 16px 0 0' }}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #D4AF37, #B8960C)' }}>
              <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '13px', color: '#1A0000' }}>{table.tableNumber}</span>
            </div>
            <div>
              <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '16px', color: '#fff', lineHeight: 1 }}>
                Table {table.tableNumber}
              </p>
              <p className="flex items-center gap-1 mt-1" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px' }}>
                <areaCfg.Icon size={10} /> {table.area} · {table.seats} seats
              </p>
            </div>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.1)' }}>
            <X size={14} style={{ color: 'rgba(255,255,255,0.7)' }} />
          </button>
        </div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ backgroundColor: cfg.bg }}>
          <StatusIcon size={11} style={{ color: cfg.dot }} />
          <span style={{ fontSize: '11px', fontWeight: 700, color: cfg.text, fontFamily: 'var(--font-heading)' }}>{cfg.label}</span>
        </div>
      </div>

      <div className="p-5 space-y-5 overflow-y-auto flex-1">
        {/* Quick Actions */}
        <div>
          <p style={{ ...labelStyle, marginBottom: '10px' }}>Quick Actions</p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setShowQR(true)}
              className="flex flex-col items-center gap-1.5 py-3 rounded-xl transition-all hover:shadow-md active:scale-95"
              style={{ backgroundColor: '#DBEAFE', border: '1px solid #93C5FD' }}
            >
              <QrCode size={18} style={{ color: '#1E40AF' }} />
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#1E40AF', fontFamily: 'var(--font-heading)' }}>View QR</span>
            </button>
            <a
              href={`/table/${table.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-1.5 py-3 rounded-xl transition-all hover:shadow-md"
              style={{ backgroundColor: '#EDE9FE', border: '1px solid #C4B5FD', textDecoration: 'none' }}
            >
              <Eye size={18} style={{ color: '#7C3AED' }} />
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#7C3AED', fontFamily: 'var(--font-heading)' }}>Preview</span>
            </a>
            <button
              onClick={handleResetTable}
              className="flex flex-col items-center gap-1.5 py-3 rounded-xl transition-all hover:shadow-md active:scale-95"
              style={{ backgroundColor: '#DCFCE7', border: '1px solid #86EFAC' }}
            >
              <RefreshCw size={18} style={{ color: '#16A34A' }} />
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#16A34A', fontFamily: 'var(--font-heading)' }}>Reset</span>
            </button>
            <button
              onClick={handleDeleteTable}
              className="flex flex-col items-center gap-1.5 py-3 rounded-xl transition-all hover:shadow-md active:scale-95"
              style={{ backgroundColor: '#FEE2E2', border: '1px solid #FCA5A5' }}
            >
              <Trash2 size={18} style={{ color: '#DC2626' }} />
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#DC2626', fontFamily: 'var(--font-heading)' }}>Delete</span>
            </button>
          </div>
        </div>

        {/* Current Order */}
        {selectedOrder ? (
          <div>
            <div className="flex items-center justify-between mb-3">
              <p style={{ ...labelStyle, marginBottom: 0 }}>Current Order</p>
              <span className="flex items-center gap-1 px-2 py-1 rounded-full" style={{ backgroundColor: statusConfig[selectedOrder.status as TableStatus]?.bg || '#F3F4F6' }}>
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: statusConfig[selectedOrder.status as TableStatus]?.dot || '#9CA3AF' }} />
                <span style={{ fontSize: '10px', fontWeight: 700, color: statusConfig[selectedOrder.status as TableStatus]?.text || '#374151', fontFamily: 'var(--font-heading)' }}>{selectedOrder.status}</span>
              </span>
            </div>
            <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(107,15,15,0.1)' }}>
              {/* Order header */}
              <div className="px-4 py-3" style={{ backgroundColor: '#FDF8F3', borderBottom: '1px solid rgba(107,15,15,0.08)' }}>
                <div className="flex items-center justify-between">
                  <div>
                    <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '13px', color: '#111' }}>
                      Order #{(selectedOrder.id || '').slice(-6).toUpperCase()}
                    </p>
                    <p style={{ fontSize: '11px', color: '#9CA3AF' }}>
                      {new Date(selectedOrder.createdAt).toLocaleTimeString()} · <ElapsedTime since={selectedOrder.createdAt} />
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock size={11} style={{ color: '#6B7280' }} />
                    <span style={{ fontSize: '11px', color: '#6B7280', fontFamily: 'var(--font-heading)' }}>
                      {selectedOrder.items.length} item{selectedOrder.items.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              </div>

              {/* Items list */}
              <div className="px-4 py-3 space-y-2.5">
                {selectedOrder.items.map(item => (
                  <div key={item.itemId} className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <img src={item.image} alt={item.name} className="w-9 h-9 rounded-lg object-cover flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="truncate" style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '12px', color: '#111' }}>{item.name}</p>
                        {item.note && (
                          <p className="flex items-center gap-1 truncate" style={{ fontSize: '10px', color: '#9CA3AF' }}>
                            <StickyNote size={9} /> {item.note}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <p style={{ fontSize: '11px', color: '#6B7280', fontFamily: 'var(--font-heading)', fontWeight: 600 }}>×{item.quantity}</p>
                      <p style={{ fontSize: '12px', color: '#6B0F0F', fontFamily: 'var(--font-heading)', fontWeight: 700 }}>৳{item.price * item.quantity}</p>
                    </div>
                  </div>
                ))}
                {selectedOrder.customerNote && (
                  <div className="flex items-start gap-2 px-3 py-2 rounded-xl mt-2" style={{ backgroundColor: 'rgba(107,15,15,0.04)', border: '1px solid rgba(107,15,15,0.1)' }}>
                    <StickyNote size={13} style={{ color: '#6B0F0F', flexShrink: 0, marginTop: '1px' }} />
                    <p style={{ fontSize: '11px', color: '#6B0F0F' }}>{selectedOrder.customerNote}</p>
                  </div>
                )}
              </div>

              {/* Total */}
              <div className="px-4 py-3 flex items-center justify-between" style={{ borderTop: '1px solid rgba(107,15,15,0.08)', backgroundColor: '#FDF8F3' }}>
                <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '13px', color: '#374151' }}>Total</span>
                <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '18px', color: '#6B0F0F' }}>৳{selectedOrder.total}</span>
              </div>

              {/* Status Action Buttons */}
              <div className="px-4 py-3 space-y-2" style={{ borderTop: '1px solid rgba(107,15,15,0.06)' }}>
                {orderStatusNext[selectedOrder.status] && (() => {
                  const nextStatus = orderStatusNext[selectedOrder.status]!;
                  const NextIcon = orderStatusIcon[selectedOrder.status] || ArrowRight;
                  const isConfirm = selectedOrder.status === 'Pending';
                  return (
                    <button
                      onClick={() => updateTableOrderStatus(selectedOrder.id!, nextStatus)}
                      className="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:shadow-md hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2"
                      style={{
                        background: isConfirm
                          ? 'linear-gradient(135deg, #16A34A, #15803D)'
                          : 'linear-gradient(135deg, #6B0F0F, #4A0A0A)',
                        fontFamily: 'var(--font-heading)',
                      }}
                    >
                      <NextIcon size={14} />
                      {orderStatusLabel[selectedOrder.status]}
                    </button>
                  );
                })()}
                <button
                  onClick={() => setShowInvoice(selectedOrder.id || null)}
                  className="w-full py-2 rounded-xl text-sm font-semibold transition-all hover:shadow-md flex items-center justify-center gap-2"
                  style={{ backgroundColor: '#F3F4F6', color: '#374151', fontFamily: 'var(--font-heading)' }}
                >
                  <Receipt size={13} /> View Invoice
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center rounded-2xl" style={{ backgroundColor: '#F9F5F0', border: '1.5px dashed rgba(107,15,15,0.2)' }}>
            <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: '#F3F4F6' }}>
              <Utensils size={24} style={{ color: '#D1D5DB' }} />
            </div>
            <p style={{ fontSize: '13px', color: '#9CA3AF', fontFamily: 'var(--font-heading)', fontWeight: 600 }}>No active order</p>
            <p style={{ fontSize: '11px', color: '#D1D5DB', marginTop: '4px' }}>Scan QR to start ordering</p>
          </div>
        )}

        {/* Order History */}
        {(() => {
          const history = tableOrders.filter(
            o => o.tableId === table.id && ['Served', 'Paid'].includes(o.status)
          );
          if (history.length === 0) return null;
          return (
            <div>
              <p style={{ ...labelStyle, marginBottom: '10px' }}>Order History</p>
              <div className="space-y-2">
                {history.slice(0, 5).map(o => (
                  <div key={o.id} className="flex items-center justify-between px-3 py-2.5 rounded-xl" style={{ backgroundColor: '#F9F5F0', border: '1px solid rgba(107,15,15,0.06)' }}>
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#F3F4F6' }}>
                        <FileText size={12} style={{ color: '#9CA3AF' }} />
                      </div>
                      <div className="min-w-0">
                        <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '12px', color: '#111' }}>#{(o.id || '').slice(-6).toUpperCase()}</p>
                        <p style={{ fontSize: '10px', color: '#9CA3AF' }}>{new Date(o.createdAt).toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '13px', color: '#6B0F0F' }}>৳{o.total}</span>
                      <button onClick={() => setShowInvoice(o.id || null)} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors">
                        <Receipt size={12} style={{ color: '#9CA3AF' }} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}
      </div>

      {/* Modals */}
      {showQR && <QRModal table={table} onClose={() => setShowQR(false)} />}
      {showInvoice && <InvoiceModal orderId={showInvoice} onClose={() => setShowInvoice(null)} />}
    </>
  );

  if (isDrawer) {
    return (
      <div
        className="fixed inset-0 z-50 flex flex-col justify-end"
        style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
        onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      >
        <div
          className="bg-white flex flex-col"
          style={{ borderRadius: '20px 20px 0 0', maxHeight: '90vh', boxShadow: '0 -20px 60px rgba(0,0,0,0.3)' }}
        >
          {panelContent}
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 flex-shrink-0">
      <div className="bg-white rounded-2xl shadow-sm flex flex-col sticky top-0" style={{ border: '1px solid rgba(0,0,0,0.06)', maxHeight: 'calc(100vh - 120px)' }}>
        {panelContent}
      </div>
    </div>
  );
}

// ─── Main TableManagement Component ──────────────────────────────────────────
export function TableManagement() {
  const { state, dispatch, showNotification } = useApp();

  const tables = state.tables ?? [];
  const tableOrders = state.tableOrders ?? [];

  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);
  const [showAddTable, setShowAddTable] = useState(false);
  const [tableForm, setTableForm] = useState<{ tableNumber: string; seats: string; area: TableArea }>({
    tableNumber: '', seats: '4', area: 'Dining',
  });
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  const selectedTable = tables.find(t => t.id === selectedTableId) || null;
  const tablesByArea = (area: TableArea) => tables.filter(t => t.area === area);

  const handleAddTable = () => {
    if (!tableForm.tableNumber || !tableForm.seats) {
      showNotification('Table number and seats are required.', 'error');
      return;
    }
    if (tables.find(t => t.id === tableForm.tableNumber)) {
      showNotification('Table number already exists.', 'error');
      return;
    }
    const newTable: RestaurantTable = {
      id: tableForm.tableNumber,
      tableNumber: tableForm.tableNumber,
      seats: Number(tableForm.seats),
      area: tableForm.area,
      status: 'Available',
    };
    dispatch({ type: 'ADD_TABLE', payload: newTable });
    showNotification(`Table ${tableForm.tableNumber} added!`, 'success');
    setShowAddTable(false);
    setTableForm({ tableNumber: '', seats: '4', area: 'Dining' });
  };

  const totalTables = tables.length;
  const availableTables = tables.filter(t => t.status === 'Available').length;
  const activeTables = totalTables - availableTables;
  const pendingOrders = tableOrders.filter(o => o.status === 'Pending').length;

  return (
    <div className="flex gap-5 h-full">
      {/* ── Left/Main: Floor Map ───────────────────────────── */}
      <div className="flex-1 min-w-0 space-y-5">

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Total Tables',  value: totalTables,       Icon: TableProperties, color: '#6B0F0F', bg: '#FEE2E2' },
            { label: 'Available',     value: availableTables,   Icon: CheckCircle,     color: '#16A34A', bg: '#DCFCE7' },
            { label: 'Occupied',      value: activeTables,      Icon: Users,           color: '#EA580C', bg: '#FEF3C7' },
            { label: 'New Orders',    value: pendingOrders,     Icon: Bell,            color: '#7C3AED', bg: '#EDE9FE' },
          ].map(({ label, value, Icon, color, bg }) => (
            <div key={label} className="bg-white p-4 rounded-2xl shadow-sm" style={{ border: '1px solid rgba(0,0,0,0.04)' }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-2" style={{ backgroundColor: bg }}>
                <Icon size={16} style={{ color }} />
              </div>
              <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '24px', color, lineHeight: 1 }}>{value}</p>
              <p style={{ fontSize: '11px', color: '#6B7280', fontFamily: 'var(--font-heading)', fontWeight: 600, marginTop: '3px' }}>{label}</p>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '16px', color: '#111' }}>
            Restaurant Floor Layout
          </h3>
          <div className="flex gap-2 flex-wrap">
            <a
              href="/kitchen"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all hover:shadow-md"
              style={{ backgroundColor: '#FEF3C7', color: '#92400E', fontFamily: 'var(--font-heading)', border: '1px solid #FDE68A', textDecoration: 'none' }}
            >
              <ChefHat size={14} />
              <span className="hidden sm:inline">Kitchen Display</span>
              <span className="sm:hidden">Kitchen</span>
            </a>
            <button
              onClick={() => setShowAddTable(true)}
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:shadow-lg hover:-translate-y-0.5"
              style={{ background: 'linear-gradient(135deg, #6B0F0F, #4A0A0A)', fontFamily: 'var(--font-heading)' }}
            >
              <Plus size={15} />
              <span className="hidden sm:inline">Add Table</span>
              <span className="sm:hidden">Add</span>
            </button>
          </div>
        </div>

        {/* Status Legend */}
        <div className="flex flex-wrap gap-2">
          {Object.entries(statusConfig).map(([key, cfg]) => {
            const LegIcon = cfg.icon;
            return (
              <div key={key} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ backgroundColor: cfg.bg, border: `1px solid ${cfg.border}` }}>
                <LegIcon size={10} style={{ color: cfg.dot }} />
                <span style={{ fontSize: '11px', fontWeight: 600, color: cfg.text, fontFamily: 'var(--font-heading)' }}>{cfg.label}</span>
              </div>
            );
          })}
        </div>

        {/* Floor Areas */}
        <div className="space-y-4">
          {areas.map(area => {
            const areaTables = tablesByArea(area);
            if (areaTables.length === 0) return null;
            const areaCfg = areaConfig[area];
            return (
              <div key={area} className="rounded-2xl p-4 sm:p-5" style={{ backgroundColor: areaCfg.bg, border: `1px solid ${areaCfg.borderColor}` }}>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${areaCfg.color}15`, border: `1px solid ${areaCfg.color}25` }}>
                    <areaCfg.Icon size={15} style={{ color: areaCfg.color }} />
                  </div>
                  <h4 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '14px', color: areaCfg.color }}>
                    {areaCfg.label}
                  </h4>
                  <span className="px-2 py-0.5 rounded-full" style={{ backgroundColor: `${areaCfg.color}12`, color: areaCfg.color, fontSize: '11px', fontWeight: 700, fontFamily: 'var(--font-heading)' }}>
                    {areaTables.length} tables
                  </span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '10px' }}>
                  {areaTables.map(table => (
                    <TableCard
                      key={table.id}
                      table={table}
                      isSelected={selectedTableId === table.id}
                      onClick={() => setSelectedTableId(selectedTableId === table.id ? null : table.id)}
                    />
                  ))}
                </div>
              </div>
            );
          })}

          {tables.length === 0 && (
            <div className="py-16 text-center rounded-2xl" style={{ backgroundColor: '#fff', border: '2px dashed rgba(107,15,15,0.15)' }}>
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#FEE2E2' }}>
                <TableProperties size={28} style={{ color: '#6B0F0F' }} />
              </div>
              <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '16px', color: '#374151', marginBottom: '6px' }}>No tables yet</p>
              <p style={{ fontSize: '13px', color: '#9CA3AF' }}>Click "Add Table" to create your first table.</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Right: Table Detail Panel (desktop) ────────────── */}
      {selectedTable && !isMobile && (
        <TableDetailPanel
          table={selectedTable}
          onClose={() => setSelectedTableId(null)}
        />
      )}

      {/* ── Bottom Drawer (mobile) ─────────────────────────── */}
      {selectedTable && isMobile && (
        <TableDetailPanel
          table={selectedTable}
          onClose={() => setSelectedTableId(null)}
          isDrawer
        />
      )}

      {/* ── Add Table Modal ──────────────────────────────────── */}
      {showAddTable && (
        <TableModal
          title="Add New Table"
          form={tableForm}
          setForm={setTableForm}
          onSave={handleAddTable}
          onClose={() => setShowAddTable(false)}
        />
      )}
    </div>
  );
}
