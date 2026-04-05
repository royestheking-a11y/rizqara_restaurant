/// <reference types="vite/client" />
import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';

// ─── Existing Types ────────────────────────────────────────────────────────────
export interface MenuItem {
  id: string;
  name: string;
  slug: string;
  category: 'Kebab' | 'Chinese' | 'Thai' | 'Indian' | 'Biryani' | 'Drinks' | 'Dessert';
  price: number;
  image: string;
  description: string;
  ingredients: string[];
  nutrition: { calories: number; protein: string; carbs: string; fat: string };
  spiceLevel: 'Mild' | 'Medium' | 'Hot' | 'Extra Hot';
  rating: number;
  reviewCount: number;
  isVeg: boolean;
  isSpicy: boolean;
  isPopular: boolean;
  prepTime: string;
  serves: string;
}

export interface GalleryImage {
  id: string;
  url: string;
  category: 'Restaurant' | 'Food' | 'Events' | 'Kitchen';
  title: string;
}

export interface CarouselSlide {
  id: string;
  url: string;
  title: string;
  subtitle: string;
  description: string;
  badge: string;
}

export interface CartItem {
  item: MenuItem;
  quantity: number;
  specialRequest?: string;
}

export type OrderStatus = 'Pending' | 'Preparing' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
export type PaymentMethod = 'bKash' | 'Nagad' | 'Cash on Delivery';

export interface Order {
  id?: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  customerName: string;
  phone: string;
  address: string;
  createdAt: string;
  estimatedTime: string;
  orderNumber: string;
}

export type ReservationStatus = 'Pending' | 'Confirmed' | 'Rejected' | 'Cancelled';

export interface Reservation {
  id?: string;
  name: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  guests: number;
  specialRequest: string;
  status: ReservationStatus;
  createdAt: string;
}

export interface Message {
  id?: string;
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  isRead: boolean;
  reply?: string;
}

export interface CateringRequest {
  id?: string;
  name: string;
  phone: string;
  email: string;
  eventType: string;
  guests: number;
  date: string;
  location: string;
  package: string;
  message: string;
  status: 'Pending' | 'Confirmed' | 'Rejected';
  createdAt: string;
}

// ─── NEW: QR Table Ordering Types ─────────────────────────────────────────────

export type TableStatus = 'Available' | 'Ordering' | 'Cooking' | 'Ready' | 'Served' | 'Paid';
export type TableArea = 'Dining' | 'VIP' | 'Outdoor';

export interface RestaurantTable {
  id: string;
  tableNumber: string;
  seats: number;
  area: TableArea;
  status: TableStatus;
  currentOrderId?: string;
  occupiedSince?: number;
}

export type TableOrderStatus = 'Pending' | 'Confirmed' | 'Cooking' | 'Ready' | 'Served' | 'Paid';

export interface TableOrderItem {
  itemId: string;
  name: string;
  price: number;
  quantity: number;
  note: string;
  image: string;
}

export interface TableOrder {
  id?: string;
  tableId: string;
  tableNumber: string;
  items: TableOrderItem[];
  total: number;
  status: TableOrderStatus;
  createdAt: number;
  customerNote: string;
}

// ─── State ────────────────────────────────────────────────────────────────────

interface AppState {
  cart: CartItem[];
  orders: Order[];
  reservations: Reservation[];
  messages: Message[];
  cateringRequests: CateringRequest[];
  menuItems: MenuItem[];
  galleryImages: GalleryImage[];
  carouselSlides: CarouselSlide[];
  tables: RestaurantTable[];
  tableOrders: TableOrder[];
  isAdminLoggedIn: boolean;
  cartOpen: boolean;
  notification: { message: string; type: 'success' | 'error' | 'info' } | null;
  isLoading: boolean;
}

// ─── Actions ──────────────────────────────────────────────────────────────────

type Action =
  | { type: 'ADD_TO_CART'; payload: { item: MenuItem; quantity: number; specialRequest?: string } }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'PLACE_ORDER'; payload: Order }
  | { type: 'UPDATE_ORDER_STATUS'; payload: { id: string; status: OrderStatus } }
  | { type: 'ADD_RESERVATION'; payload: Reservation }
  | { type: 'UPDATE_RESERVATION'; payload: { id: string; status: ReservationStatus } }
  | { type: 'DELETE_RESERVATION'; payload: string }
  | { type: 'ADD_MESSAGE'; payload: Message }
  | { type: 'READ_MESSAGE'; payload: string }
  | { type: 'DELETE_MESSAGE'; payload: string }
  | { type: 'REPLY_MESSAGE'; payload: { id: string; reply: string } }
  | { type: 'ADD_CATERING'; payload: CateringRequest }
  | { type: 'UPDATE_CATERING'; payload: { id: string; status: 'Pending' | 'Confirmed' | 'Rejected' } }
  | { type: 'ADD_MENU_ITEM'; payload: MenuItem }
  | { type: 'UPDATE_MENU_ITEM'; payload: MenuItem }
  | { type: 'DELETE_MENU_ITEM'; payload: string }
  | { type: 'ADD_GALLERY_IMAGE'; payload: GalleryImage }
  | { type: 'UPDATE_GALLERY_IMAGE'; payload: GalleryImage }
  | { type: 'DELETE_GALLERY_IMAGE'; payload: string }
  | { type: 'ADD_CAROUSEL_SLIDE'; payload: CarouselSlide }
  | { type: 'UPDATE_CAROUSEL_SLIDE'; payload: CarouselSlide }
  | { type: 'DELETE_CAROUSEL_SLIDE'; payload: string }
  // Table actions
  | { type: 'ADD_TABLE'; payload: RestaurantTable }
  | { type: 'UPDATE_TABLE'; payload: RestaurantTable }
  | { type: 'DELETE_TABLE'; payload: string }
  | { type: 'SET_TABLE_STATUS'; payload: { id: string; status: TableStatus; currentOrderId?: string; occupiedSince?: number } }
  // Table order actions
  | { type: 'PLACE_TABLE_ORDER'; payload: TableOrder }
  | { type: 'UPDATE_TABLE_ORDER_STATUS'; payload: { id: string; status: TableOrderStatus } }
  | { type: 'DELETE_TABLE_ORDER'; payload: string }
  // System
  | { type: 'ADMIN_LOGIN' }
  | { type: 'ADMIN_LOGOUT' }
  | { type: 'TOGGLE_CART' }
  | { type: 'SET_CART_OPEN'; payload: boolean }
  | { type: 'SET_NOTIFICATION'; payload: { message: string; type: 'success' | 'error' | 'info' } | null }
  | { type: 'LOAD_FROM_SERVER'; payload: Partial<AppState> }
  | { type: 'SET_LOADING'; payload: boolean };

// ─── Initial State ────────────────────────────────────────────────────────────

const initialState: AppState = {
  cart: [],
  orders: [],
  reservations: [],
  messages: [],
  cateringRequests: [],
  menuItems: [],
  galleryImages: [],
  carouselSlides: [],
  tables: [],
  tableOrders: [],
  isAdminLoggedIn: false,
  cartOpen: false,
  notification: null,
  isLoading: true,
};

// ─── Reducer (Memory/UI Only) ──────────────────────────────────────────────────

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'LOAD_FROM_SERVER':
      return {
        ...state,
        ...action.payload,
        isLoading: false,
      };

    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };

    case 'ADD_TO_CART': {
      const existing = state.cart.find(c => c.item.id === action.payload.item.id);
      let newCart;
      if (existing) {
        newCart = state.cart.map(c =>
          c.item.id === action.payload.item.id
            ? { ...c, quantity: c.quantity + action.payload.quantity }
            : c
        );
      } else {
        newCart = [...state.cart, {
          item: action.payload.item,
          quantity: action.payload.quantity,
          specialRequest: action.payload.specialRequest,
        }];
      }
      localStorage.setItem('rizqara_cart', JSON.stringify(newCart));
      return { ...state, cart: newCart };
    }

    case 'REMOVE_FROM_CART': {
      const newCart = state.cart.filter(c => c.item.id !== action.payload);
      localStorage.setItem('rizqara_cart', JSON.stringify(newCart));
      return { ...state, cart: newCart };
    }

    case 'UPDATE_QUANTITY': {
      const newCart = state.cart.map(c =>
        c.item.id === action.payload.id
          ? { ...c, quantity: Math.max(1, action.payload.quantity) }
          : c
      );
      localStorage.setItem('rizqara_cart', JSON.stringify(newCart));
      return { ...state, cart: newCart };
    }

    case 'CLEAR_CART':
      localStorage.removeItem('rizqara_cart');
      return { ...state, cart: [] };

    case 'PLACE_ORDER':
      return { ...state, orders: [action.payload, ...state.orders], cart: [] };

    case 'UPDATE_ORDER_STATUS':
      return {
        ...state,
        orders: state.orders.map(o =>
          o.id === action.payload.id ? { ...o, status: action.payload.status } : o
        ),
      };

    case 'ADD_RESERVATION':
      return { ...state, reservations: [action.payload, ...state.reservations] };

    case 'UPDATE_RESERVATION':
      return {
        ...state,
        reservations: state.reservations.map(r =>
          r.id === action.payload.id ? { ...r, status: action.payload.status } : r
        ),
      };

    case 'DELETE_RESERVATION':
      return { ...state, reservations: state.reservations.filter(r => r.id !== action.payload) };

    case 'ADD_MESSAGE':
      return { ...state, messages: [action.payload, ...state.messages] };

    case 'READ_MESSAGE':
      return {
        ...state,
        messages: state.messages.map(m =>
          m.id === action.payload ? { ...m, isRead: true } : m
        ),
      };

    case 'DELETE_MESSAGE':
      return { ...state, messages: state.messages.filter(m => m.id !== action.payload) };

    case 'REPLY_MESSAGE':
      return {
        ...state,
        messages: state.messages.map(m =>
          m.id === action.payload.id
            ? { ...m, reply: action.payload.reply, isRead: true }
            : m
        ),
      };

    case 'ADD_CATERING':
      return { ...state, cateringRequests: [action.payload, ...state.cateringRequests] };

    case 'UPDATE_CATERING':
      return {
        ...state,
        cateringRequests: state.cateringRequests.map(c =>
          c.id === action.payload.id ? { ...c, status: action.payload.status } : c
        ),
      };

    case 'ADD_MENU_ITEM':
      return { ...state, menuItems: [action.payload, ...state.menuItems] };

    case 'UPDATE_MENU_ITEM':
      return {
        ...state,
        menuItems: state.menuItems.map(m =>
          m.id === action.payload.id ? action.payload : m
        ),
      };

    case 'DELETE_MENU_ITEM':
      return { ...state, menuItems: state.menuItems.filter(m => m.id !== action.payload) };

    case 'ADD_GALLERY_IMAGE':
      return { ...state, galleryImages: [...state.galleryImages, action.payload] };

    case 'UPDATE_GALLERY_IMAGE':
      return {
        ...state,
        galleryImages: state.galleryImages.map(g =>
          g.id === action.payload.id ? action.payload : g
        ),
      };

    case 'DELETE_GALLERY_IMAGE':
      return { ...state, galleryImages: state.galleryImages.filter(g => g.id !== action.payload) };

    case 'ADD_CAROUSEL_SLIDE':
      return { ...state, carouselSlides: [...state.carouselSlides, action.payload] };

    case 'UPDATE_CAROUSEL_SLIDE':
      return {
        ...state,
        carouselSlides: state.carouselSlides.map(s =>
          s.id === action.payload.id ? action.payload : s
        ),
      };

    case 'DELETE_CAROUSEL_SLIDE':
      return { ...state, carouselSlides: state.carouselSlides.filter(s => s.id !== action.payload) };

    case 'ADD_TABLE':
      return { ...state, tables: [...state.tables, action.payload] };

    case 'UPDATE_TABLE':
      return {
        ...state,
        tables: state.tables.map(t => t.id === action.payload.id ? action.payload : t),
      };

    case 'DELETE_TABLE':
      return { ...state, tables: state.tables.filter(t => t.id !== action.payload) };

    case 'SET_TABLE_STATUS':
      return {
        ...state,
        tables: state.tables.map(t =>
          t.id === action.payload.id
            ? {
                ...t,
                status: action.payload.status,
                currentOrderId: action.payload.currentOrderId,
                occupiedSince: action.payload.occupiedSince,
              }
            : t
        ),
      };

    case 'PLACE_TABLE_ORDER':
      return { ...state, tableOrders: [action.payload, ...state.tableOrders] };

    case 'UPDATE_TABLE_ORDER_STATUS':
      return {
        ...state,
        tableOrders: state.tableOrders.map(o =>
          o.id === action.payload.id ? { ...o, status: action.payload.status } : o
        ),
      };

    case 'DELETE_TABLE_ORDER':
      return { ...state, tableOrders: state.tableOrders.filter(o => o.id !== action.payload) };

    case 'ADMIN_LOGIN':
      localStorage.setItem('isAdminLoggedIn', 'true');
      return { ...state, isAdminLoggedIn: true };

    case 'ADMIN_LOGOUT':
      localStorage.removeItem('isAdminLoggedIn');
      return { ...state, isAdminLoggedIn: false };

    case 'TOGGLE_CART':
      return { ...state, cartOpen: !state.cartOpen };

    case 'SET_CART_OPEN':
      return { ...state, cartOpen: action.payload };

    case 'SET_NOTIFICATION':
      return { ...state, notification: action.payload };

    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  addToCart: (item: MenuItem, quantity?: number, specialRequest?: string) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  showNotification: (message: string, type?: 'success' | 'error' | 'info') => void;
  placeTableOrder: (order: TableOrder) => void;
  updateTableOrderStatus: (id: string, status: TableOrderStatus) => void;
  setTableStatus: (id: string, status: TableStatus, orderId?: string) => void;
}

// ─── Environment Configuration ──────────────────────────────────────────────
const rawApiBase = import.meta.env.VITE_API_BASE_URL || '';
export const API_BASE = rawApiBase 
  ? (rawApiBase.endsWith('/api') ? rawApiBase : `${rawApiBase.replace(/\/$/, '')}/api`)
  : '/api';

export const AppContext = createContext<AppContextType | undefined>(undefined);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, defaultDispatch] = useReducer(reducer, initialState);

  // Network intercepts
  const dispatch = (action: Action) => {
    // 1. Optimistic Update
    defaultDispatch(action);

    // 2. Network Persist
    const headers = { 'Content-Type': 'application/json' };
    const performApiCall = async () => {
      try {
        switch (action.type) {
          case 'PLACE_ORDER':
            await fetch(`${API_BASE}/orders`, { method: 'POST', body: JSON.stringify(action.payload), headers });
            localStorage.removeItem('rizqara_cart');
            break;
          case 'UPDATE_ORDER_STATUS':
            await fetch(`${API_BASE}/orders/${action.payload.id}`, { method: 'PUT', body: JSON.stringify({ status: action.payload.status }), headers });
            break;
          case 'ADD_RESERVATION':
            await fetch(`${API_BASE}/reservations`, { method: 'POST', body: JSON.stringify(action.payload), headers });
            break;
          case 'UPDATE_RESERVATION':
            await fetch(`${API_BASE}/reservations/${action.payload.id}`, { method: 'PUT', body: JSON.stringify({ status: action.payload.status }), headers });
            break;
          case 'DELETE_RESERVATION':
            await fetch(`${API_BASE}/reservations/${action.payload}`, { method: 'DELETE' });
            break;
          case 'ADD_MESSAGE':
            await fetch(`${API_BASE}/messages`, { method: 'POST', body: JSON.stringify(action.payload), headers });
            break;
          case 'READ_MESSAGE':
            await fetch(`${API_BASE}/messages/${action.payload}`, { method: 'PUT', body: JSON.stringify({ isRead: true }), headers });
            break;
          case 'DELETE_MESSAGE':
            await fetch(`${API_BASE}/messages/${action.payload}`, { method: 'DELETE' });
            break;
          case 'REPLY_MESSAGE':
            await fetch(`${API_BASE}/messages/${action.payload.id}`, { method: 'PUT', body: JSON.stringify({ reply: action.payload.reply, isRead: true }), headers });
            break;
          case 'ADD_CATERING':
            await fetch(`${API_BASE}/catering-requests`, { method: 'POST', body: JSON.stringify(action.payload), headers });
            break;
          case 'UPDATE_CATERING':
            await fetch(`${API_BASE}/catering-requests/${action.payload.id}`, { method: 'PUT', body: JSON.stringify({ status: action.payload.status }), headers });
            break;
          case 'ADD_MENU_ITEM':
            await fetch(`${API_BASE}/menu`, { method: 'POST', body: JSON.stringify(action.payload), headers });
            break;
          case 'UPDATE_MENU_ITEM':
            await fetch(`${API_BASE}/menu/${action.payload.id}`, { method: 'PUT', body: JSON.stringify(action.payload), headers });
            break;
          case 'DELETE_MENU_ITEM':
            await fetch(`${API_BASE}/menu/${action.payload}`, { method: 'DELETE' });
            break;
          case 'ADD_GALLERY_IMAGE':
            await fetch(`${API_BASE}/gallery`, { method: 'POST', body: JSON.stringify(action.payload), headers });
            break;
          case 'UPDATE_GALLERY_IMAGE':
            await fetch(`${API_BASE}/gallery/${action.payload.id}`, { method: 'PUT', body: JSON.stringify(action.payload), headers });
            break;
          case 'DELETE_GALLERY_IMAGE':
            await fetch(`${API_BASE}/gallery/${action.payload}`, { method: 'DELETE' });
            break;
          case 'ADD_CAROUSEL_SLIDE':
            await fetch(`${API_BASE}/carousel`, { method: 'POST', body: JSON.stringify(action.payload), headers });
            break;
          case 'UPDATE_CAROUSEL_SLIDE':
            await fetch(`${API_BASE}/carousel/${action.payload.id}`, { method: 'PUT', body: JSON.stringify(action.payload), headers });
            break;
          case 'DELETE_CAROUSEL_SLIDE':
            await fetch(`${API_BASE}/carousel/${action.payload}`, { method: 'DELETE' });
            break;
          case 'ADD_TABLE':
            await fetch(`${API_BASE}/tables`, { method: 'POST', body: JSON.stringify(action.payload), headers });
            break;
          case 'UPDATE_TABLE':
            await fetch(`${API_BASE}/tables/${action.payload.id}`, { method: 'PUT', body: JSON.stringify(action.payload), headers });
            break;
          case 'DELETE_TABLE':
            await fetch(`${API_BASE}/tables/${action.payload}`, { method: 'DELETE' });
            break;
          case 'SET_TABLE_STATUS':
            await fetch(`${API_BASE}/tables/${action.payload.id}`, { method: 'PUT', body: JSON.stringify({ status: action.payload.status, currentOrderId: action.payload.currentOrderId, occupiedSince: action.payload.occupiedSince }), headers });
            break;
          case 'PLACE_TABLE_ORDER':
            await fetch(`${API_BASE}/table-orders`, { method: 'POST', body: JSON.stringify(action.payload), headers });
            break;
          case 'UPDATE_TABLE_ORDER_STATUS':
            await fetch(`${API_BASE}/table-orders/${action.payload.id}`, { method: 'PUT', body: JSON.stringify({ status: action.payload.status }), headers });
            break;
          case 'DELETE_TABLE_ORDER':
            await fetch(`${API_BASE}/table-orders/${action.payload}`, { method: 'DELETE' });
            break;
        }
      } catch (err) {
        console.error('API Post Error:', err);
      }
    };
    performApiCall();
  };

  const loadData = async () => {
    try {
      const [
        menuItemsReq, galleryReq, carouselReq, tablesReq, tableOrdersReq, 
        ordersReq, reservationsReq, messagesReq, cateringReq
      ] = await Promise.all([
        fetch(`${API_BASE}/menu`).then(res => res.json()),
        fetch(`${API_BASE}/gallery`).then(res => res.json()),
        fetch(`${API_BASE}/carousel`).then(res => res.json()),
        fetch(`${API_BASE}/tables`).then(res => res.json()),
        fetch(`${API_BASE}/table-orders`).then(res => res.json()),
        fetch(`${API_BASE}/orders`).then(res => res.json()),
        fetch(`${API_BASE}/reservations`).then(res => res.json()),
        fetch(`${API_BASE}/messages`).then(res => res.json()),
        fetch(`${API_BASE}/catering-requests`).then(res => res.json()),
      ]);

      const savedCart = localStorage.getItem('rizqara_cart');
      const adminStatus = localStorage.getItem('isAdminLoggedIn');

      defaultDispatch({
        type: 'LOAD_FROM_SERVER',
        payload: {
          menuItems: Array.isArray(menuItemsReq) ? menuItemsReq : [],
          galleryImages: Array.isArray(galleryReq) ? galleryReq : [],
          carouselSlides: Array.isArray(carouselReq) ? carouselReq : [],
          tables: Array.isArray(tablesReq) ? tablesReq : [],
          tableOrders: Array.isArray(tableOrdersReq) ? tableOrdersReq.reverse() : [],
          orders: Array.isArray(ordersReq) ? ordersReq.reverse() : [],
          reservations: Array.isArray(reservationsReq) ? reservationsReq.reverse() : [],
          messages: Array.isArray(messagesReq) ? messagesReq.reverse() : [],
          cateringRequests: Array.isArray(cateringReq) ? cateringReq.reverse() : [],
          cart: savedCart ? JSON.parse(savedCart) : state.cart,
          isAdminLoggedIn: !!adminStatus,
        }
      });
    } catch (err) {
      console.error('Error loading data from DB:', err);
      defaultDispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  useEffect(() => {
    loadData();
    
    // Smart Polling - Update every 10 seconds for real-time dashboard
    const pollInterval = setInterval(() => {
      loadData();
    }, 10000);

    return () => clearInterval(pollInterval);
  }, []);

  useEffect(() => {
    if (state.notification) {
      const timer = setTimeout(() => {
        defaultDispatch({ type: 'SET_NOTIFICATION', payload: null });
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [state.notification]);

  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    dispatch({ type: 'SET_NOTIFICATION', payload: { message, type } });
  };

  const addToCart = (item: MenuItem, quantity = 1, specialRequest?: string) => {
    dispatch({ type: 'ADD_TO_CART', payload: { item, quantity, specialRequest } });
    showNotification(`${item.name} added to cart!`, 'success');
  };

  const removeFromCart = (id: string) => dispatch({ type: 'REMOVE_FROM_CART', payload: id });
  const updateQuantity = (id: string, quantity: number) => dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  const clearCart = () => dispatch({ type: 'CLEAR_CART' });

  const placeTableOrder = (order: TableOrder) => {
    dispatch({ type: 'PLACE_TABLE_ORDER', payload: order });
    dispatch({
      type: 'SET_TABLE_STATUS',
      payload: { id: order.tableId, status: 'Ordering', currentOrderId: order.id, occupiedSince: order.createdAt },
    });
  };

  const updateTableOrderStatus = (id: string, status: TableOrderStatus) => {
    dispatch({ type: 'UPDATE_TABLE_ORDER_STATUS', payload: { id, status } });
    const order = state.tableOrders.find(o => o.id === id);
    if (order) {
      const tableStatus: TableStatus =
        status === 'Pending' ? 'Ordering' :
        status === 'Confirmed' ? 'Ordering' :
        status === 'Cooking' ? 'Cooking' :
        status === 'Ready' ? 'Ready' :
        status === 'Served' ? 'Served' :
        status === 'Paid' ? 'Paid' : 'Available';
      dispatch({ type: 'SET_TABLE_STATUS', payload: { id: order.tableId, status: tableStatus, currentOrderId: id } });
    }
  };

  const setTableStatus = (id: string, status: TableStatus, orderId?: string) => {
    dispatch({ type: 'SET_TABLE_STATUS', payload: { id, status, currentOrderId: orderId } });
  };

  const cartTotal = state.cart.reduce((sum, c) => sum + c.item.price * c.quantity, 0);
  const cartCount = state.cart.reduce((sum, c) => sum + c.quantity, 0);

  return (
    <AppContext.Provider
      value={{
        state,
        dispatch,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
        showNotification,
        placeTableOrder,
        updateTableOrderStatus,
        setTableStatus,
      }}
    >
      {state.isLoading ? (
        <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      ) : children}
    </AppContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}