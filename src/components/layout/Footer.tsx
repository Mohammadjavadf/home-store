import { Link } from 'react-router-dom';
import { Send, Phone, Mail } from 'lucide-react';
import Logo from './Logo';
import { useSettingsStore } from '../../store/settingsStore';

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export default function Footer() {
  const settings = useSettingsStore((s) => s.settings);

  const socials = [
    { Icon: InstagramIcon, label: 'اینستاگرام', href: settings.instagram },
    { Icon: Send, label: 'تلگرام', href: settings.telegram },
    { Icon: Phone, label: 'تلفن', href: `tel:${settings.phone}` },
    { Icon: Mail, label: 'ایمیل', href: `mailto:${settings.email}` },
  ];

  return (
    <footer className="bg-night text-night-ink mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <div className="bg-white/5 inline-block p-3 rounded-2xl mb-4">
              <Logo variant="light" />
            </div>
            <p className="text-sm text-night-ink/60 leading-relaxed max-w-sm">
              {settings.description}
            </p>
            <div className="flex gap-3 mt-6">
              {socials.map(({ Icon, label, href }, i) => (
                <a
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-white/5 hover:bg-copper flex items-center justify-center transition-colors"
                  aria-label={label}
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-display font-bold mb-4 text-sm">دسترسی سریع</h4>
            <ul className="space-y-2.5 text-sm text-night-ink/60">
              {[
                { to: '/products', label: 'محصولات' },
                { to: '/blog', label: 'وبلاگ' },
                { to: '/cart', label: 'سبد خرید' },
                { to: '/about', label: 'درباره ما' },
                { to: '/contact', label: 'تماس با ما' },
              ].map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="hover:text-copper-light transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold mb-4 text-sm">پشتیبانی</h4>
            <ul className="space-y-2.5 text-sm text-night-ink/60">
              <li>{settings.phone}</li>
              <li>{settings.email}</li>
              <li>شنبه تا پنجشنبه، ۹ تا ۱۸</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-6 text-center text-xs text-night-ink/40">
          © ۱۴۰۳ {settings.name} — تمامی حقوق محفوظ است.
        </div>
      </div>
    </footer>
  );
}