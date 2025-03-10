'use client';

import { Fragment, useMemo, useState, type FC, type ReactNode } from 'react';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type Row,
  type SortingState,
} from '@tanstack/react-table';
import { useMedia } from 'react-use';

import type { TxEntry } from '@/lib/types/tx';
import { CHAINS } from '@/lib/constants/providers';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import CurrencyAmount from '@/components/common/currency-amount';
import ElapsedTime from '@/components/common/elapsed-time';
import ShrinkedAddress from '@/components/common/shrinked-address';
import TooltipResponsive from '@/components/common/tooltip-responsive';
import TxHistoryCollapsibleMobile from '@/components/core/tx-history/collapsible-mobile';
import { DataTableColumnHeader } from '@/components/templates/table/column-header';
import DataTableExpandable from '@/components/templates/table/data-table-expandable';
import { DataTableFacetedFilter } from '@/components/templates/table/faceted-filter';
import { DataTableViewOptions } from '@/components/templates/table/view';

type TxHistoryTableProps = {
  data: TxEntry[] | undefined;
  loading?: boolean;
};

// The loading row with mock data (just to display a skeleton)
const getLoadingRow = (id: number): TxEntry => ({
  id,
  context: {
    chainId: 0,
    target: {
      address: '0x',
      balance: BigInt(0),
      deployedBytecode: '0x',
      nonce: BigInt(0),
      storageRoot: '0x',
      codeHash: '0x',
      isContract: false,
      isEmpty: true,
    },
    caller: '0x',
    functionName: '',
    inputValues: [],
    value: '0',
  },
  data: '',
  decoded: false,
  status: 'failure',
  logs: null,
  errors: null,
  gasUsed: '0',
  timestamp: Date.now(),
});

/* -------------------------------------------------------------------------- */
/*                              TX HISTORY TABLE                              */
/* -------------------------------------------------------------------------- */

/**
 * @notice A table to display the history of transactions made on a chain (fork)
 * @dev This will display both successful and failed transactions made locally after forking a chain,
 * whether they modified the state or not (read/write).
 * @param data The history of transactions fetched from local storage
 * @param loading Whether the latest transaction is being processed (or a client initializing)
 * @returns A table with the history of transactions
 */
const TxHistoryTable: FC<TxHistoryTableProps> = ({ data, loading }) => {
  /* ---------------------------------- STATE --------------------------------- */
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  // Display table layout from large desktop
  const isLargeDesktop = useMedia('(min-width: 1024px)'); // lg

  /* --------------------------------- COLUMNS -------------------------------- */
  // Id, type, function/selector (if relevant), timestamp, status
  const columns: ColumnDef<TxEntry>[] = useMemo(() => {
    // Render a loading skeleton if it's the latest transaction being processed or the original data if it's not
    const getCellNode = (cell: ReactNode | string, id: number) =>
      data === undefined || (loading && id === data.length + 1) ? (
        <Skeleton className="h-4 w-16" />
      ) : (
        cell
      );

    return [
      {
        accessorKey: 'id',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="#" />
        ),
        cell: ({ row }) => (
          <span className="text-secondary-foreground mr-2 lg:mr-0">
            {row.original.id + 1}
          </span>
        ),
      },
      {
        accessorKey: 'call',
        header: () => <span className="text-xs">Call</span>,
        cell: ({ row }) =>
          getCellNode(
            row.original.context.target.isContract ? (
              <Badge>contract</Badge>
            ) : row.original.context.target.isContract !== undefined ? (
              <Badge className="secondary">EOA</Badge>
            ) : (
              <Badge variant="outline">?</Badge>
            ),
            row.original.id,
          ),
      },
      {
        accessorKey: 'name',
        header: () => <span className="text-xs">Function</span>,
        cell: ({ row }) =>
          getCellNode(
            <pre className="text-left">
              {row.original.context.functionName ?? (
                <span className="text-secondary-foreground text-left">
                  arbitrary call
                </span>
              )}
            </pre>,
            row.original.id,
          ),
        filterFn: (row, id, value) => {
          return row.original.context.functionName?.includes(value) || false;
        },
      },
      {
        accessorKey: 'timestamp',
        header: () => <span className="text-xs">Date</span>,
        cell: ({ row }) =>
          getCellNode(
            <TooltipResponsive
              trigger={
                <span>
                  <ElapsedTime start={row.original.timestamp} suffix="ago" />
                </span>
              }
              content={new Date(row.original.timestamp).toLocaleString()}
            />,
            row.original.id,
          ),
      },
      {
        accessorKey: 'status',
        filterFn: (row, id, value) => {
          return value.includes(row.getValue(id));
        },
        header: () => <span className="text-xs">Status</span>,
        cell: ({ row }) =>
          getCellNode(
            row.original.status === 'success' ? (
              <Badge variant="outline">Success</Badge>
            ) : row.original.status === 'revert' ? (
              <Badge variant="destructive">Reverted</Badge>
            ) : (
              <Badge variant="destructive">Error</Badge>
            ),
            row.original.id,
          ),
      },
    ];
  }, [data, loading]);

  /* ------------------------------- EXPANDABLE ------------------------------- */
  // context (chain, target, caller, inputValues), data (decoded?), logs, errors, gasUsed
  const expandableCell = (row: Row<TxEntry>) => {
    return data === undefined ||
      (loading && row.original.id === data.length + 1) ? (
      <Skeleton className="my-2 h-24 w-full" />
    ) : (
      <>
        <TxDetailsSubTable tx={row.original} />
        <div className="bg-muted/30 grid grid-cols-[min-content_1fr] justify-between gap-x-4 gap-y-2 p-2">
          <span className="text-xs font-medium">Data</span>
          {row.original.data && row.original.data !== '0x' ? (
            <pre className="overflow-x-auto text-xs break-words whitespace-pre-wrap">
              {row.original.data}
            </pre>
          ) : (
            <span className="text-secondary-foreground text-xs">No data</span>
          )}
          <span className="text-xs font-medium">Errors</span>
          {row.original.errors ? (
            <ScrollArea className="border-secondary max-h-48 rounded-sm border p-2">
              <div className="grid grid-cols-[min-content_1fr] gap-x-2 gap-y-1 text-xs">
                {row.original.errors.map((e, i) => (
                  <pre key={i}>
                    <span className="text-secondary-foreground">{i + 1}.</span>
                    {e.message.replace('\n\n', '\n')}
                  </pre>
                ))}
              </div>
            </ScrollArea>
          ) : (
            <span className="text-secondary-foreground text-xs">No errors</span>
          )}
          <span className="text-xs font-medium">Logs</span>
          {row.original.logs && row.original.logs.length > 0 ? (
            <ScrollArea className="border-secondary max-h-48 rounded-sm border p-2">
              <div className="grid grid-cols-[min-content_1fr_1fr_1fr] gap-x-2 gap-y-1 text-xs text-wrap">
                <span />
                <span className="text-secondary-foreground">Address</span>
                <span className="text-secondary-foreground">Data</span>
                <span className="text-secondary-foreground">Topics</span>
                {row.original.logs.map((l, i) => (
                  <Fragment key={i}>
                    <pre className="text-secondary-foreground">{i + 1}.</pre>
                    <pre>{l.address}</pre>
                    <pre>{l.data}</pre>
                    <pre>{l.topics.join(', ')}</pre>
                  </Fragment>
                ))}
              </div>
            </ScrollArea>
          ) : (
            <span className="text-secondary-foreground text-xs">No logs</span>
          )}
          <Separator className="col-span-2 my-2 w-8" />
          <span className="text-xs font-medium whitespace-nowrap">Inputs</span>
          {row.original.context.inputValues.length > 0 &&
          !(
            row.original.context.inputValues.length === 1 &&
            row.original.context.inputValues[0].value === '0x'
          ) ? (
            <ScrollArea className="border-secondary max-h-48 rounded-sm border p-2">
              <div className="grid grid-cols-[min-content_1fr] gap-x-2 gap-y-1 text-xs text-wrap">
                {row.original.context.inputValues.map((input, i) => (
                  <Fragment key={i}>
                    <pre className="text-secondary-foreground">
                      {input.name !== '' ? input.name : `arg ${i + 1}`}
                    </pre>
                    <pre className="flex flex-col gap-1">
                      {Array.isArray(input.value)
                        ? input.value.map((v, j) => (
                            <span key={j} className="text-xs">
                              {v.toString()}
                            </span>
                          ))
                        : input.value.toString()}
                    </pre>
                  </Fragment>
                ))}
              </div>
            </ScrollArea>
          ) : (
            <span className="text-secondary-foreground text-xs">No inputs</span>
          )}
        </div>
      </>
    );
  };

  /* ---------------------------------- DATA ---------------------------------- */
  // Sort the data by id (latest first)
  const dataMemoized = useMemo(() => {
    const sorted = data?.sort((a, b) => b.id - a.id) || [];

    // If data is undefined, it could not yet retrieve the transactions (loading)
    if (data === undefined) {
      return [getLoadingRow(1)];
    }

    // If loading (processing a tx), add a loading entry first
    if (loading) {
      return [getLoadingRow((data?.length ?? 0) + 1 || 1), ...sorted];
    }

    return sorted;
  }, [data, loading]);

  /* ---------------------------------- TABLE --------------------------------- */
  const table = useReactTable<TxEntry>({
    data: dataMemoized,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
    // Pagination
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: isLargeDesktop ? 10 : 5,
      },
    },
    // Sorting
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    // Filtering
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  /* ----------------------------- RENDER DESKTOP ----------------------------- */
  if (isLargeDesktop)
    return (
      <DataTableExpandable<TxEntry>
        table={table}
        expandableRender={expandableCell}
        pagination={dataMemoized.length > 10}
        className="border-secondary rounded-none border-x px-2"
        noDataLabel="No transactions yet."
        header={
          <div className="flex w-full items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="grow font-medium whitespace-nowrap">
                Local transactions
              </span>
              <Input
                placeholder="Filter transactions..."
                value={
                  (table.getColumn('name')?.getFilterValue() as string) ?? ''
                }
                onChange={(e) =>
                  table.getColumn('name')?.setFilterValue(e.target.value)
                }
                className="max-w-sm"
              />
              {table.getColumn('status') ? (
                <DataTableFacetedFilter
                  className="ml-2"
                  column={table.getColumn('status')}
                  title="Status"
                  options={[
                    { value: 'success', label: 'Success' },
                    { value: 'revert', label: 'Reverted' },
                    { value: 'failure', label: 'Error' },
                  ]}
                />
              ) : null}
            </div>
            <DataTableViewOptions table={table} />
          </div>
        }
      />
    );

  /* -------------------------- RENDER MOBILE/TABLET -------------------------- */
  return (
    <TxHistoryCollapsibleMobile
      table={table}
      expandableRender={expandableCell}
      header={
        <div className="grid grid-cols-[1fr_min-content] items-center gap-4">
          <span className="grow font-medium whitespace-nowrap">
            Local transactions
          </span>
          {table.getColumn('status') ? (
            <DataTableFacetedFilter
              className="ml-2"
              column={table.getColumn('status')}
              title="Status"
              options={[
                { value: 'success', label: 'Success' },
                { value: 'revert', label: 'Reverted' },
                { value: 'failure', label: 'Error' },
              ]}
            />
          ) : null}
          <Input
            placeholder="Filter transactions..."
            value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
            onChange={(e) =>
              table.getColumn('name')?.setFilterValue(e.target.value)
            }
            className="col-span-2"
          />
        </div>
      }
      noDataLabel="No transactions yet."
      pagination={dataMemoized.length > 5}
    />
  );
};

/* -------------------------------------------------------------------------- */
/*                              TX DETAILS TABLE                              */
/* -------------------------------------------------------------------------- */

type TxDetailsSubTableProps = {
  tx: TxEntry;
};

/**
 * @notice A sub-table to display the details of a transaction
 * @dev This will display the context of the transaction (chain, target, caller, inputValues),
 * the data (decoded?), logs, errors, and gasUsed.
 * @dev We don't need anything fancy here, just a simple grid with the details
 * @param tx The transaction to display
 * @returns A sub-table with the details of the transaction
 */
const TxDetailsSubTable: FC<TxDetailsSubTableProps> = ({ tx }) => {
  const txChain = useMemo(
    () => CHAINS.find((c) => c.id === tx.context.chainId),
    [tx.context.chainId],
  );

  /* ---------------------------------- TABLE --------------------------------- */
  const table = useMemo(
    () => [
      {
        header: () => 'Chain',
        cell: () => txChain?.name || tx.context.chainId,
      },
      {
        header: () => 'Account',
        cell: () => (
          <ShrinkedAddress
            address={tx.context.target.address}
            explorer={txChain?.blockExplorers?.default.url}
            adapt={false}
          />
        ),
      },
      {
        header: () => 'Caller',
        cell: () => (
          <ShrinkedAddress
            address={tx.context.caller}
            explorer={txChain?.blockExplorers?.default.url}
            adapt={false}
          />
        ),
      },
      {
        header: () => 'Tx value',
        cell: () => (
          <CurrencyAmount
            amount={tx.context.value}
            symbol={txChain?.nativeCurrency.symbol}
          />
        ),
      },
      {
        header: () => 'Gas used',
        cell: () => tx.gasUsed,
      },
    ],
    [tx, txChain],
  );

  /* --------------------------------- RENDER --------------------------------- */
  return (
    <div className="bg-muted/30 grid grid-cols-1 gap-x-4 gap-y-2 p-2 lg:grid-cols-5">
      {table.map((row, i) => (
        <div key={i} className="flex flex-col gap-2">
          <span className="text-secondary-foreground text-xs font-medium">
            {row.header()}
          </span>
          {row.cell()}
        </div>
      ))}
    </div>
  );
};

export default TxHistoryTable;
