import { forwardRef } from 'react';
import type { ButtonHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

type Variant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'light';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variants: Record<Variant, string> = {
  primary:
    'bg-copper text-white hover:bg-copper-dark shadow-soft hover:shadow-glow',
  secondary: 'bg-forest text-white hover:bg-forest-light shadow-soft',
  outline:
    'border-2 border-copper/40 text-copper hover:bg-copper hover:text-white',
  ghost: 'text-ink dark:text-night-ink hover:bg-copper/10',
  light: 'bg-white text-copper hover:bg-cream',
};

const sizes: Record<Size, string> = {
  sm: 'px-3.5 py-2 text-sm rounded-xl',
  md: 'px-5 py-2.5 text-sm rounded-xl',
  lg: 'px-7 py-3.5 text-base rounded-2xl',
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200',
          'active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-copper/50',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
export default Button;