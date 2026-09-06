import React, { useState } from 'react';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../utils/cn';
import { Button } from './Button';

export interface Column<T> {
  key: string;
  header: string;
  render?: (item: T, index: number) => React.ReactNode;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
  className?: string;
  width?: string;
}

export interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  pageSize?: number;
  onRowClick?: (item: T) => void;
  selectedKey?: string;
  emptyText?: string;
  className?: string;
}

export const Table = <T extends Record<string, any>>({
  columns,
  data,
  keyExtractor,
  pageSize = 5,
  onRowClick,
  selectedKey,
  emptyText = 'No sonar detection records located.',
  className,
}: TableProps<T>) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const sortedData = React.useMemo(() => {
    if (!sortKey) return data;
    return [...data].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (aVal === bVal) return 0;
      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;
      const res = aVal > bVal ? 1 : -1;
      return sortDirection === 'asc' ? res : -res;
    });
  }, [data, sortKey, sortDirection]);

  const totalPages = Math.ceil(sortedData.length / pageSize) || 1;
  const paginatedData = sortedData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className={cn('w-full border border-marine-750 rounded-md overflow-hidden bg-marine-900/90 shadow-md', className)}>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-marine-950/80 border-b border-marine-800 text-slate-400 uppercase tracking-wider font-semibold font-mono">
              {columns.map((col) => {
                const isSorted = sortKey === col.key;
                return (
                  <th
                    key={col.key}
                    style={{ width: col.width }}
                    className={cn(
                      'px-4 py-3 select-none',
                      col.sortable && 'cursor-pointer hover:text-cyan-300 transition-colors',
                      col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left',
                      col.className
                    )}
                    onClick={() => col.sortable && handleSort(col.key)}
                  >
                    <div className={cn('inline-flex items-center gap-1.5', col.align === 'right' && 'flex-row-reverse')}>
                      <span>{col.header}</span>
                      {col.sortable && (
                        <span className="text-slate-500">
                          {isSorted ? (
                            sortDirection === 'asc' ? (
                              <ChevronUp size={14} className="text-cyan-400" />
                            ) : (
                              <ChevronDown size={14} className="text-cyan-400" />
                            )
                          ) : (
                            <ChevronDown size={14} className="opacity-30" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-marine-800/60">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center text-slate-400">
                  {emptyText}
                </td>
              </tr>
            ) : (
              paginatedData.map((item, index) => {
                const key = keyExtractor(item);
                const isSelected = selectedKey === key;

                return (
                  <tr
                    key={key}
                    onClick={() => onRowClick?.(item)}
                    className={cn(
                      'transition-colors duration-150',
                      onRowClick && 'cursor-pointer',
                      isSelected
                        ? 'bg-cyan-950/40 border-l-2 border-l-cyan-400'
                        : 'hover:bg-marine-800/60'
                    )}
                  >
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className={cn(
                          'px-4 py-3 text-slate-200 align-middle',
                          col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left',
                          col.className
                        )}
                      >
                        {col.render ? col.render(item, index) : item[col.key]}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-2.5 bg-marine-950/60 border-t border-marine-800 text-xs text-slate-400">
          <div className="font-mono">
            Showing <span className="text-cyan-300 font-semibold">{(currentPage - 1) * pageSize + 1}</span> to{' '}
            <span className="text-cyan-300 font-semibold">{Math.min(currentPage * pageSize, sortedData.length)}</span> of{' '}
            <span className="text-white font-semibold">{sortedData.length}</span> records
          </div>
          <div className="flex items-center gap-1.5">
            <Button
              variant="secondary"
              size="xs"
              isIconOnly
              icon={ChevronLeft}
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              aria-label="Previous Page"
            />
            <span className="font-mono text-slate-300 px-2">
              {currentPage} / {totalPages}
            </span>
            <Button
              variant="secondary"
              size="xs"
              isIconOnly
              icon={ChevronRight}
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              aria-label="Next Page"
            />
          </div>
        </div>
      )}
    </div>
  );
};
