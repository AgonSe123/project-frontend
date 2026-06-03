export function LoadingSpinner({ label = 'Loading…' }) {
  return (
    <div
      className="flex flex-col items-center gap-3 py-8 text-muted"
      role="status"
      aria-live="polite"
    >
      <div
        className="h-8 w-8 animate-spin rounded-full border-[3px] border-[#dce8ef] border-t-brand"
        aria-hidden="true"
      />
      <span>{label}</span>
    </div>
  );
}
