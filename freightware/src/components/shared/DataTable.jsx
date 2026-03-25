'use client';

import { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';

export default function DataTable({
  columns,
  data,
  onRowClick,
  rowClassName,
  emptyMessage = 'No data to display',
}) {
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState('asc');

  const handleSort = (key) => {
    if (!key) return;
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const sorted = useMemo(() => {
    if (!sortKey) return data;
    return [...data].sort((a, b) => {
      const col = columns.find((c) => c.key === sortKey);
      const aVal = col?.sortValue ? col.sortValue(a) : a[sortKey];
      const bVal = col?.sortValue ? col.sortValue(b) : b[sortKey];
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      if (typeof aVal === 'string') {
        return sortDir === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
    });
  }, [data, sortKey, sortDir, columns]);

  if (!data.length) {
    return (
      <div className="text-center py-12 text-fw-text-muted text-sm">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-fw-border">
            {columns.map((col) => (
              <th
                key={col.key}
                className={`text-left py-3 px-3 text-xs font-medium text-fw-text-muted uppercase tracking-wider whitespace-nowrap ${
                  col.sortable !== false ? 'cursor-pointer select-none hover:text-fw-text' : ''
                }`}
                style={col.width ? { width: col.width } : undefined}
                onClick={() => col.sortable !== false && handleSort(col.key)}
              >
                <div className="flex items-center gap-1">
                  {col.label}
                  {col.sortable !== false && (
                    <span className="text-fw-text-muted">
                      {sortKey === col.key ? (
                        sortDir === 'asc' ? (
                          <ChevronUp size={14} />
                        ) : (
                          <ChevronDown size={14} />
                        )
                      ) : (
                        <ChevronsUpDown size={12} />
                      )}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((row, i) => (
            <tr
              key={row.id || i}
              onClick={() => onRowClick?.(row)}
              className={`border-b border-fw-border/50 transition-colors ${
                onRowClick ? 'cursor-pointer' : ''
              } ${
                i % 2 === 0 ? 'bg-fw-surface' : 'bg-fw-surface-2'
              } hover:bg-fw-cyan/5 ${
                rowClassName ? rowClassName(row) : ''
              }`}
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className="py-3 px-3 text-fw-text whitespace-nowrap"
                >
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
