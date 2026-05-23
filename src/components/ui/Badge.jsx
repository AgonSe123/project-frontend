const toneClass = {
  default: 'badge-default',
  success: 'badge-success',
  warning: 'badge-warning',
  danger: 'badge-danger',
  info: 'badge-info',
};

export function Badge({ tone = 'default', children }) {
  return <span className={`badge ${toneClass[tone]}`}>{children}</span>;
}
