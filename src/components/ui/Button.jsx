import { cn } from '@/lib/cn';

const variantClass = {
  primary:
    'bg-brand text-white hover:bg-brand-dark rounded-full font-semibold px-5 py-2.5',
  secondary:
    'bg-white border border-gray-200 text-brand-dark hover:bg-[#e7f1ff] hover:border-brand rounded-xl font-semibold px-5 py-2.5',
  danger:
    'bg-red-400 text-white hover:bg-red-500 rounded-xl font-semibold px-5 py-2.5',
  ghost:
    'bg-transparent text-brand-dark hover:bg-[#e7f1ff] rounded-xl font-semibold px-5 py-2.5',
};

const headerVariantClass = {
  primary:
    'bg-white text-brand-dark hover:bg-brand-dark hover:text-white rounded-full font-semibold px-5 py-2.5',
  ghost:
    'text-white border border-white/45 hover:bg-white/15 rounded-full font-semibold px-5 py-2.5',
};

export function Button({
  variant = 'primary',
  header = false,
  children,
  loading,
  disabled,
  className = '',
  ...props
}) {
  const styles = header ? headerVariantClass : variantClass;

  return (
    <button
      type="button"
      className={cn(
        'inline-flex items-center justify-center gap-1.5 transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-60',
        styles[variant] ?? styles.primary,
        className,
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? 'Please wait…' : children}
    </button>
  );
}
