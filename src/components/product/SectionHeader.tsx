interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
}

export default function SectionHeader({ eyebrow, title, description }: SectionHeaderProps) {
  return (
    <div className="text-center mb-12">
      {eyebrow && (
        <span className="inline-block text-xs font-bold text-copper tracking-wider uppercase mb-3">
          {eyebrow}
        </span>
      )}
      <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-ink dark:text-night-ink mb-3 text-balance">
        {title}
      </h2>
      {description && (
        <p className="text-ink/60 dark:text-night-ink/60 max-w-2xl mx-auto text-balance">
          {description}
        </p>
      )}
    </div>
  );
}