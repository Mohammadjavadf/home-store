import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useNotificationsStore } from './notificationsStore';

export interface AuthUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface StoredAccount extends AuthUser {
  password: string;
}

interface AuthState {
  user: AuthUser | null;
  accounts: StoredAccount[];
  login: (email: string, password: string) => { ok: boolean; error?: string };
  register: (data: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
  }) => { ok: boolean; error?: string };
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accounts: [],

      login: (email, password) => {
        const account = get().accounts.find(
          (a) => a.email.toLowerCase() === email.toLowerCase()
        );
        if (!account) return { ok: false, error: 'حسابی با این ایمیل یافت نشد' };
        if (account.password !== password)
          return { ok: false, error: 'رمز عبور اشتباه است' };

        const { password: _pw, ...user } = account;
        set({ user });
        return { ok: true };
      },

      register: (data) => {
        const exists = get().accounts.some(
          (a) => a.email.toLowerCase() === data.email.toLowerCase()
        );
        if (exists) return { ok: false, error: 'این ایمیل قبلاً ثبت شده است' };

        const newAccount: StoredAccount = {
          id: `user-${Date.now()}`,
          ...data,
        };
        const { password: _pw, ...user } = newAccount;
        set((s) => ({
          accounts: [...s.accounts, newAccount],
          user,
        }));

        // اعلان کاربر جدید
        useNotificationsStore.getState().addNotification({
          type: 'user',
          title: 'کاربر جدید',
          message: `${data.firstName} ${data.lastName} ثبت‌نام کرد`,
          link: '/admin/users',
        });

        return { ok: true };
      },

      logout: () => set({ user: null }),
    }),
    { name: 'khanestore-auth', version: 1 }
  )
);