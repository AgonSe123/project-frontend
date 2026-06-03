import { cn } from '@/lib/cn';

const toneClass = {
  default: 'bg-brand-light text-muted',
  success: 'bg-green-100 text-green-700',
  warning: 'bg-yellow-100 text-yellow-700',
  danger: 'bg-red-100 text-red-700',
  info: 'bg-[#e7f1ff] text-brand-dark',
};

export function Badge({ tone = 'default', children }) {
  return (
    <span
      className={cn(
        'inline-block rounded-full px-2.5 py-0.5 text-[0.7rem] font-bold uppercase tracking-wide',
        toneClass[tone],
      )}
    >
      {children}
    </span>
  );
}
