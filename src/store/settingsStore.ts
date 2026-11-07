import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface StoreSettings {
  name: string;
  tagline: string;
  description: string;
  phone: string;
  email: string;
  address: string;
  instagram: string;
  telegram: string;
  shippingCost: number;
  freeShippingThreshold: number;
  pointsPerHundredThousand: number;
  onlinePaymentEnabled: boolean;
  codPaymentEnabled: boolean;
}

const defaultSettings: StoreSettings = {
  name: 'خانه‌استور',
  tagline: 'لوازم خانگی مدرن',
  description: 'فروشگاه لوازم خانگی مدرن و خاص',
  phone: '۰۲۱-۱۲۳۴۵۶۷۸',
  email: 'info@khanestore.ir',
  address: 'تهران، خیابان ولیعصر، پلاک ۱۲۳',
  instagram: 'https://instagram.com/khanestore',
  telegram: 'https://t.me/khanestore',
  shippingCost: 350_000,
  freeShippingThreshold: 5_000_000,
  pointsPerHundredThousand: 1,
  onlinePaymentEnabled: true,
  codPaymentEnabled: true,
};

interface SettingsState {
  settings: StoreSettings;
  updateSettings: (updates: Partial<StoreSettings>) => void;
  resetToDefault: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      settings: defaultSettings,

      updateSettings: (updates) =>
        set((s) => ({ settings: { ...s.settings, ...updates } })),

      resetToDefault: () => set({ settings: defaultSettings }),
    }),
    { name: 'khanestore-settings', version: 1 }
  )
);