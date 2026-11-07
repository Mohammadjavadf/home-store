import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const ADMIN_EMAIL = 'admin@khanestore.ir';
const ADMIN_PASSWORD = 'admin123';
const ADMIN_NAME = 'مدیر خانه‌استور';

export interface AdminUser {
  email: string;
  name: string;
}

interface AdminState {
  admin: AdminUser | null;
  login: (email: string, password: string) => { ok: boolean; error?: string };
  logout: () => void;
  isAuthenticated: () => boolean;
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set, get) => ({
      admin: null,

      login: (email, password) => {
        const trimmedEmail = email.trim().toLowerCase();
        if (trimmedEmail !== ADMIN_EMAIL) {
          return { ok: false, error: 'ایمیل ادمین نامعتبر است' };
        }
        if (password !== ADMIN_PASSWORD) {
          return { ok: false, error: 'رمز عبور اشتباه است' };
        }
        set({ admin: { email: ADMIN_EMAIL, name: ADMIN_NAME } });
        return { ok: true };
      },

      logout: () => set({ admin: null }),

      isAuthenticated: () => get().admin !== null,
    }),
    { name: 'khanestore-admin', version: 1 }
  )
);

export const ADMIN_CREDENTIALS = {
  email: ADMIN_EMAIL,
  password: ADMIN_PASSWORD,
};