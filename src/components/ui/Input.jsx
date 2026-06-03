import { cn } from '@/lib/cn';

export function Input({ label, error, id, className = '', hideLabel = false, ...props }) {
  const inputId = id ?? props.name ?? label.toLowerCase().replace(/\s/g, '-');

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {!hideLabel && (
        <label htmlFor={inputId} className="text-sm font-semibold text-brand-dark">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={cn(
          'rounded-md border border-[#ced4da] bg-white px-3 py-2.5 text-brand-dark outline-none focus:border-brand focus:ring-2 focus:ring-[#e7f1ff]',
          error && 'border-red-400',
        )}
        {...props}
      />
      {error && <span className="text-sm text-red-500">{error}</span>}
    </div>
  );
}
