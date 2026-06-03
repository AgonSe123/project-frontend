import { cn } from '@/lib/cn';

export function Card({ title, children, className = '', hover = false }) {
  return (
    <div
      className={cn(
        'rounded-2xl bg-white p-6 shadow-md',
        hover && 'transition duration-200 hover:-translate-y-1 hover:shadow-lg',
        className,
      )}
    >
      {title && (
        <h3 className="mb-3 text-lg font-bold text-brand-dark">{title}</h3>
      )}
      {children}
    </div>
  );
}
