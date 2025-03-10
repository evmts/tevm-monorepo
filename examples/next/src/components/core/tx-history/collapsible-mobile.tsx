import type { ReactNode } from 'react';
import {
  flexRender,
  type Row,
  type Table as TableInterface,
} from '@tanstack/react-table';

import { cn } from '@/lib/utils';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import DataTablePagination from '@/components/templates/table/pagination';

/* ---------------------------------- TYPES --------------------------------- */
type TxHistoryCollapsibleMobileProps<TData> = {
  table: TableInterface<TData>;
  expandableRender: (row: Row<TData>) => ReactNode;
  header: ReactNode;
  noDataLabel?: string;
  pagination?: boolean;
  className?: string;
};

/**
 * @notice An alternative to a table for displaying the txs history on mobile (in collapsibles)
 * @param table The table instance from tanstack react-table
 * @param expandableRender The methode to render the expandable content (row)
 * @param header A header displayed above the collapsibles
 * @param noDataLabel A label to display when there is no data (default: 'No results.')
 * @param pagination Whether to display pagination (default: false)
 * @param className Additional classes to apply to the wrapper
 */
const TxHistoryCollapsibleMobile = <TData,>({
  table,
  expandableRender,
  header,
  noDataLabel = 'No results.',
  pagination = false,
  className,
}: TxHistoryCollapsibleMobileProps<TData>) => {
  return (
    <div className={cn('flex flex-col gap-2 rounded-md', className)}>
      {header ? <div className="p-2">{header}</div> : null}
      <Accordion type="single" collapsible className="w-full">
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => (
            <AccordionItem key={row.id} value={row.id}>
              <AccordionTrigger className="grid grid-cols-[min-content_1fr_min-content_min-content] justify-start gap-2">
                {/* id | function name | status | expand button */}
                <>
                  {flexRender(
                    row.getVisibleCells()[0].column.columnDef.cell,
                    row.getVisibleCells()[0].getContext(),
                  )}
                  {flexRender(
                    row.getVisibleCells()[2].column.columnDef.cell,
                    row.getVisibleCells()[2].getContext(),
                  )}
                  {flexRender(
                    row.getVisibleCells()[4].column.columnDef.cell,
                    row.getVisibleCells()[4].getContext(),
                  )}
                </>
              </AccordionTrigger>
              <AccordionContent className="relative">
                {/* timestamp */}
                <div className="bg-muted/30 text-secondary-foreground absolute top-0 right-0 flex justify-end px-2 pt-2 text-xs font-medium">
                  {flexRender(
                    row.getVisibleCells()[3].column.columnDef.cell,
                    row.getVisibleCells()[3].getContext(),
                  )}
                </div>

                {/* chain, account, caller, tx value, gas used, data, errors, logs, inputs */}
                {expandableRender(row)}
              </AccordionContent>
            </AccordionItem>
          ))
        ) : (
          <div className="flex items-center justify-center p-4 text-sm">
            {noDataLabel}
          </div>
        )}
      </Accordion>
      {pagination ? <DataTablePagination table={table} /> : null}
    </div>
  );
};

export default TxHistoryCollapsibleMobile;
