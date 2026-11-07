export const isValidPhone = (phone: string): boolean =>
  /^09\d{9}$/.test(phone.replace(/\s/g, ''));

export const isValidEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const isValidPostalCode = (code: string): boolean =>
  /^\d{10}$/.test(code.replace(/\s/g, ''));

export const isValidName = (name: string): boolean =>
  name.trim().length >= 3;

export const isValidAddress = (addr: string): boolean =>
  addr.trim().length >= 10;