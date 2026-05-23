const variantClass = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  danger: 'btn-danger',
  ghost: 'btn-ghost',
};

export function Button({
  variant = 'primary',
  children,
  loading,
  disabled,
  className = '',
  ...props
}) {
  return (
    <button
      type="button"
      className={`btn ${variantClass[variant]} ${className}`.trim()}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? 'Please wait…' : children}
    </button>
  );
}
