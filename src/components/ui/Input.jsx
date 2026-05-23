export function Input({ label, error, id, className = '', ...props }) {
  const inputId = id ?? props.name ?? label.toLowerCase().replace(/\s/g, '-');

  return (
    <div className={`field ${className}`.trim()}>
      <label htmlFor={inputId}>{label}</label>
      <input id={inputId} className={error ? 'input-error' : ''} {...props} />
      {error && <span className="field-error">{error}</span>}
    </div>
  );
}
