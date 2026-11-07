import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useNotificationsStore } from './notificationsStore';

export type OrderStatus = 'pending' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  productId: string;
  name: string;
  image: string;
  brand: string;
  price: number;
  quantity: number;
  variant?: {
    name: string;
    option: string;
  };
}

export interface Order {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  createdAt: number;
  date: string;
  address: {
    province: string;
    city: string;
    address: string;
    postalCode: string;
    phone: string;
  };
  paymentMethod: 'online' | 'cod';
  couponCode?: string;
}

interface OrdersState {
  orders: Order[];
  addOrder: (order: Order) => void;
  updateStatus: (id: string, status: OrderStatus) => void;
  deleteOrder: (id: string) => void;
  getById: (id: string) => Order | undefined;
  reset: () => void;
}

export const useOrdersStore = create<OrdersState>()(
  persist(
    (set, get) => ({
      orders: [],

      addOrder: (order) => {
        set((s) => ({ orders: [order, ...s.orders] }));

        // اعلان سفارش جدید
        useNotificationsStore.getState().addNotification({
          type: 'order',
          title: 'سفارش جدید',
          message: `سفارش ${order.id} به مبلغ ${order.total.toLocaleString('fa-IR')} تومان توسط ${order.userName} ثبت شد`,
          link: `/admin/orders/${order.id}`,
        });
      },

      updateStatus: (id, status) =>
        set((s) => ({
          orders: s.orders.map((o) => (o.id === id ? { ...o, status } : o)),
        })),

      deleteOrder: (id) =>
        set((s) => ({ orders: s.orders.filter((o) => o.id !== id) })),

      getById: (id) => get().orders.find((o) => o.id === id),

      reset: () => set({ orders: [] }),
    }),
    { name: 'khanestore-orders', version: 1 }
  )
);

export const ORDER_STATUS_LABELS: Record<
  OrderStatus,
  { label: string; className: string; icon: string }
> = {
  pending: {
    label: 'در انتظار',
    className:
      'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400',
    icon: 'clock',
  },
  shipped: {
    label: 'ارسال شده',
    className:
      'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400',
    icon: 'truck',
  },
  delivered: {
    label: 'تحویل شده',
    className: 'bg-forest/10 text-forest',
    icon: 'check',
  },
  cancelled: {
    label: 'لغو شده',
    className:
      'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400',
    icon: 'x',
  },
};