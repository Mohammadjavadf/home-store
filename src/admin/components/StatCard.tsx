import type { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface StatCardProps {
  label: string;
  value: string;
  Icon: LucideIcon;
  color?: 'copper' | 'forest' | 'amber' | 'blue';
  trend?: string;
  index?: number;
}

const colorMap = {
  copper: { bg: 'bg-copper/10', text: 'text-copper', accent: 'bg-copper' },
  forest: { bg: 'bg-forest/10', text: 'text-forest', accent: 'bg-forest' },
  amber: { bg: 'bg-amber-500/10', text: 'text-amber-600', accent: 'bg-amber-500' },
  blue: { bg: 'bg-blue-500/10', text: 'text-blue-600', accent: 'bg-blue-500' },
};

export default function StatCard({
  label,
  value,
  Icon,
  color = 'copper',
  trend,
  index = 0,
}: StatCardProps) {
  const c = colorMap[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="bg-surface dark:bg-night-surface rounded-2xl border border-ink/5 dark:border-white/5 shadow-soft p-5 relative overflow-hidden"
    >
      <div className={cn('absolute top-0 right-0 w-1 h-full', c.accent)} />

      <div className="flex items-start justify-between mb-3">
        <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', c.bg)}>
          <Icon className={cn('w-5 h-5', c.text)} />
        </div>
        {trend && (
          <span className="text-[10px] font-bold text-forest bg-forest/10 px-2 py-0.5 rounded-full">
            {trend}
          </span>
        )}
      </div>

      <div className="text-xs text-ink/50 dark:text-night-ink/50 mb-1">{label}</div>
      <div className="font-display font-extrabold text-xl text-ink dark:text-night-ink">
        {value}
      </div>
    </motion.div>
  );
}