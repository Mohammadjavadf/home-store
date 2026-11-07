import type { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
}

export default function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div>
        <h1 className="text-xl sm:text-2xl font-display font-extrabold text-ink dark:text-night-ink">
          {title}
        </h1>
        {description && (
          <p className="text-xs sm:text-sm text-ink/60 dark:text-night-ink/60 mt-1">
            {description}
          </p>
        )}
      </div>
      {actions && <div className="flex gap-2 flex-wrap">{actions}</div>}
    </div>
  );
}