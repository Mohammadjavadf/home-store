import { Link } from 'react-router-dom';
import { useSettingsStore } from '../../store/settingsStore';

interface LogoProps {
  showText?: boolean;
  variant?: 'default' | 'light';
}

export default function Logo({ showText = true, variant = 'default' }: LogoProps) {
  const isLight = variant === 'light';
const settings = useSettingsStore((s) => s.settings);

  return (
    <Link to="/" className="flex items-center gap-2.5 group">
      <svg
        width="40"
        height="40"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="transition-transform duration-300 group-hover:scale-105 shrink-0"
      >
        <rect width="48" height="48" rx="14" className="fill-copper" />
        <path
          d="M14 30V18L24 12L34 18V30"
          stroke="#FAF8F5"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M19 30V22H29V30"
          stroke="#FAF8F5"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="24" cy="17" r="1.5" fill="#FAF8F5" />
      </svg>
      {showText && (
        <div className="flex flex-col leading-tight">
          <span
            className={
              isLight
                ? 'font-display font-extrabold text-base sm:text-lg text-white'
                : 'font-display font-extrabold text-base sm:text-lg text-ink dark:text-night-ink'
            }
          >
            {settings.name}
          </span>
          <span
            className={
              isLight
                ? 'text-[9px] sm:text-[10px] text-copper-light font-medium tracking-wide'
                : 'text-[9px] sm:text-[10px] text-copper font-medium tracking-wide'
            }
          >
{settings.tagline}
          </span>
        </div>
      )}
    </Link>
  );
}