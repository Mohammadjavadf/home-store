import { Moon, Sun } from 'lucide-react';
import { useThemeStore } from '../../store/themeStore';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? 'حالت روشن' : 'حالت تاریک'}
      className="relative w-10 h-10 rounded-xl bg-copper/10 hover:bg-copper/20 
                 flex items-center justify-center transition-all duration-300
                 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-copper/50"
    >
      <Sun
        className={`w-5 h-5 text-copper absolute transition-all duration-500 ${
          isDark ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'
        }`}
      />
      <Moon
        className={`w-5 h-5 text-copper absolute transition-all duration-500 ${
          isDark ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'
        }`}
      />
    </button>
  );
}