import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Address {
  id: string;
  title: string;
  province: string;
  city: string;
  address: string;
  postalCode: string;
  phone: string;
  isDefault: boolean;
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface OrderRecord {
  id: string;
  date: string;
  total: number;
  itemsCount: number;
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled';
}

interface UserState {
  profiles: Record<string, UserProfile>;        // per-user
  addressesByUser: Record<string, Address[]>;    // per-user
  ordersByUser: Record<string, OrderRecord[]>;   // per-user
  wishlistByUser: Record<string, string[]>;      // per-user

  getProfile: (userId: string) => UserProfile;
  updateProfile: (userId: string, p: Partial<UserProfile>) => void;

  getAddresses: (userId: string) => Address[];
  addAddress: (userId: string, a: Omit<Address, 'id'>) => void;
  removeAddress: (userId: string, id: string) => void;
  setDefaultAddress: (userId: string, id: string) => void;

  getOrders: (userId: string) => OrderRecord[];
  addOrder: (userId: string, o: OrderRecord) => void;

  getWishlist: (userId: string) => string[];
  toggleWishlist: (userId: string, productId: string) => void;
  clearWishlist: (userId: string) => void;
}

const emptyProfile: UserProfile = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
};

const EMPTY_ADDRESSES: Address[] = [];
const EMPTY_ORDERS: OrderRecord[] = [];
const EMPTY_WISHLIST: string[] = [];

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      profiles: {},
      addressesByUser: {},
      ordersByUser: {},
      wishlistByUser: {},

      getProfile: (userId) => get().profiles[userId] ?? emptyProfile,

      updateProfile: (userId, p) =>
        set((s) => ({
          profiles: {
            ...s.profiles,
            [userId]: { ...(s.profiles[userId] ?? emptyProfile), ...p },
          },
        })),

      getAddresses: (userId) => get().addressesByUser[userId] ?? EMPTY_ADDRESSES,

      addAddress: (userId, a) =>
        set((s) => {
          const current = s.addressesByUser[userId] ?? [];
          const newAddress: Address = {
            ...a,
            id: `addr-${Date.now()}`,
          };
          return {
            addressesByUser: {
              ...s.addressesByUser,
              [userId]: [...current, newAddress],
            },
          };
        }),

      removeAddress: (userId, id) =>
        set((s) => ({
          addressesByUser: {
            ...s.addressesByUser,
            [userId]: (s.addressesByUser[userId] ?? []).filter(
              (a) => a.id !== id
            ),
          },
        })),

      setDefaultAddress: (userId, id) =>
        set((s) => ({
          addressesByUser: {
            ...s.addressesByUser,
            [userId]: (s.addressesByUser[userId] ?? []).map((a) => ({
              ...a,
              isDefault: a.id === id,
            })),
          },
        })),

      getOrders: (userId) => get().ordersByUser[userId] ?? EMPTY_ORDERS,

      addOrder: (userId, o) =>
        set((s) => ({
          ordersByUser: {
            ...s.ordersByUser,
            [userId]: [o, ...(s.ordersByUser[userId] ?? [])],
          },
        })),

      getWishlist: (userId) => get().wishlistByUser[userId] ?? EMPTY_WISHLIST,

      toggleWishlist: (userId, productId) =>
        set((s) => {
          const current = s.wishlistByUser[userId] ?? [];
          return {
            wishlistByUser: {
              ...s.wishlistByUser,
              [userId]: current.includes(productId)
                ? current.filter((id) => id !== productId)
                : [...current, productId],
            },
          };
        }),

      clearWishlist: (userId) =>
        set((s) => ({
          wishlistByUser: {
            ...s.wishlistByUser,
            [userId]: [],
          },
        })),
    }),
    { name: 'khanestore-user-v2', version: 2 }
  )
);