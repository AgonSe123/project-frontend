import { cn } from '@/lib/cn';

export function Table({
  columns,
  data,
  keyField,
  emptyMessage = 'No data found.',
  onRowClick,
  isRowClickable,
}) {
  if (data.length === 0) {
    return <p className="text-muted">{emptyMessage}</p>;
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-[#dce8ef] bg-white shadow-sm">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className="border-b border-[#ecf3f2] bg-brand-light px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-brand-dark"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => {
            const clickable = isRowClickable ? isRowClickable(row) : Boolean(onRowClick);

            return (
              <tr
                key={String(row[keyField])}
                onClick={clickable ? () => onRowClick?.(row) : undefined}
                className={cn(
                  'hover:bg-brand-light/60',
                  clickable && 'cursor-pointer',
                )}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className="border-b border-[#ecf3f2] px-4 py-3 text-brand-dark"
                  >
                    {col.render(row)}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
