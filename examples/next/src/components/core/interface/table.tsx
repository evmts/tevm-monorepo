'use client';

import {
  FC,
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { ABI } from '@shazow/whatsabi/lib.types/abi';
import {
  ColumnDef,
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { toast } from 'sonner';

import { FunctionAbi } from '@/lib/types/config';
import { ExpectedType, Input as InputType } from '@/lib/types/tx';
import { useMediaQuery } from '@/lib/hooks/use-media-query';
import { formatTx as formatTxForLocalStorage } from '@/lib/local-storage';
import { useConfigStore } from '@/lib/store/use-config';
import { useProviderStore } from '@/lib/store/use-provider';
import { useTxStore } from '@/lib/store/use-tx';
import { callContract } from '@/lib/tevm';
import { formatInputValue } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Icons } from '@/components/common/icons';
import TooltipResponsive from '@/components/common/tooltip-responsive';
import { DataTableColumnHeader } from '@/components/templates/table/column-header';
import DataTable from '@/components/templates/table/data-table';
import { DataTableViewOptions } from '@/components/templates/table/view';

type InterfaceTableProps = {
  data: ABI | null;
  loading?: boolean;
};

// A skeleton cell to show while loading
const SkeletonCell = () => <Skeleton className="h-4 w-16" />;

/**
 * @notice A table to display the contract's interface
 * @dev This will display the contract's functions and ignore events.
 * @dev Each row shows the function's name, details, inputs that should be filled by the user,
 * and a button to call it.
 * @param data The contract's ABI
 * @param loading Whether the data is still loading
 * @returns A table with the contract's functions
 */
const InterfaceTable: FC<InterfaceTableProps> = ({ data, loading }) => {
  /* ---------------------------------- STATE --------------------------------- */
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  // Whether a function is ready to be called (all inputs are filled); by function id
  const [isCallReady, setIsCallReady] = useState<Record<string, boolean>>({});

  // Expand the table from tablet
  const isTablet = useMediaQuery('(min-width: 640px)'); // sm

  // The current blockchain data for the call
  const { chain, client } = useProviderStore((state) => ({
    chain: state.chain,
    client: state.client,
  }));
  const { account, caller, abi, skipBalance, updateAccount } = useConfigStore(
    (state) => ({
      account: state.account,
      caller: state.caller,
      abi: state.abi,
      skipBalance: state.skipBalance,
      updateAccount: state.updateAccount,
    }),
  );

  // Manage transactions and inputs
  const {
    inputValues,
    processing,
    updateInputValue,
    initializeInputs,
    setProcessing,
    saveTx,
  } = useTxStore((state) => ({
    inputValues: state.inputValues,
    processing: state.processing,
    updateInputValue: state.updateInputValue,
    initializeInputs: state.initializeInputs,
    setProcessing: state.setProcessing,
    saveTx: state.saveTx,
  }));

  // Ref to track the currently focused input's identifier
  // This is necessary because editable cells will make the whole table re-render
  // on change and the focus will be lost
  const focusedInputRef = useRef<string | null>(null);

  /* -------------------------------- HANDLERS -------------------------------- */
  // Call a function with the given input values
  const call = useCallback(
    async (
      functionName: string,
      inputValues: { type: string; name: string; value: string | number }[],
      value: string,
    ) => {
      // There is no reason this would happen (as the table would not be displayed),
      // but just in the unlikely case we should let the user know
      if (!client || !account || !abi) {
        toast.info(
          'There was an issue retrieving provider data. Please refresh the page.',
          {
            action: {
              label: 'Refresh',
              onClick: () => window.location.reload(),
            },
          },
        );
        return;
      }

      // Attempt to format inputs
      let formattedInputs: InputType[] = [];
      try {
        formattedInputs = inputValues.map((input, i) => ({
          ...inputValues[i],
          value: formatInputValue(input.type, input.value),
        }));
      } catch (err) {
        toast.error('Invalid input', {
          description:
            err instanceof Error ? err.message : "Couldn't format input",
        });
        return;
      }
      // Check the value as well
      if (value !== '' && isNaN(Number(value))) {
        toast.error('Invalid value', {
          description: 'Please enter a valid number for the value.',
        });
        return;
      }

      // Display loading state
      setProcessing(functionName);
      const loading = toast.loading(`Calling ${functionName}...`, {
        description: 'Please wait while the transaction is being processed.',
      });

      // Start processing the transaction
      const tx = await callContract(
        client,
        caller,
        account.address,
        functionName,
        abi,
        formattedInputs.map((input) => input.value),
        value,
        skipBalance,
      );

      // Report the result of the transaction to the user
      if (tx.errors?.length) {
        toast.error(tx.errors[0].title, {
          id: loading,
          description: tx.errors[0].message,
        });
      } else {
        // The result provided by the call
        const result = tx.result;
        // Prefer the data if it was decoded and not an array (too long), otherwise the raw data
        const data =
          'data' in result &&
          result.data !== undefined &&
          !Array.isArray(result.data)
            ? (result.data as ExpectedType)
            : result.rawData;
        const adaptedData =
          // Show the first 100 characters of the data if it's too long
          data.toString().length > 100
            ? `${data.toString().slice(0, 100)}...`
            : // or the entire data if it's less than 100 characters
              data;

        toast.success('Transaction successful!', {
          id: loading,
          description:
            // Don't try to display if there was no return value/transaction reverted/failed to retrieve it
            data === '0x'
              ? 'See below for more details.'
              : `Returned: ${adaptedData}. See below for more details.`,
        });
      }

      setProcessing('');

      // Update the account state after the call
      updateAccount(account.address, { updateAbi: false, chain, client }); // no need to wait for completion

      // Save the transaction to the local storage regardless of the result
      saveTx(
        chain.id,
        formatTxForLocalStorage(tx, {
          chainId: chain.id,
          target: account,
          caller,
          functionName,
          // Convert bigints to strings for local storage
          inputValues: JSON.parse(
            JSON.stringify(formattedInputs, (_, value) =>
              typeof value === 'bigint' ? value.toString() : value,
            ),
          ),
          value: tx.value,
        }),
      );
    },
    [
      chain,
      client,
      caller,
      account,
      abi,
      skipBalance,
      saveTx,
      setProcessing,
      updateAccount,
    ],
  );

  /* ------------------------------ STATE EFFECTS ----------------------------- */
  // Update isCallReady when inputValues change (true for a function if all inputs are filled)
  useEffect(() => {
    const isFilled = (id: string) => {
      const values = inputValues[id]['args'];
      if (!values) return false;
      return Object.values(values).every(
        (value) => value !== undefined && value !== '',
      );
    };

    setIsCallReady(
      Object.fromEntries(
        Object.keys(inputValues).map((id) => [id, isFilled(id)]),
      ),
    );
  }, [inputValues, focusedInputRef]);

  /* --------------------------------- COLUMNS -------------------------------- */
  const columns: ColumnDef<FunctionAbi>[] = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Function" />
        ),
        cell: ({ row }) =>
          loading ? <SkeletonCell /> : <pre>{row.original.name}</pre>,
      },
      {
        accessorKey: 'details',
        header: () => <span className="text-xs">Details</span>,
        cell: ({ row }) => {
          const mut = row.original.stateMutability;

          if (loading) return <SkeletonCell />;
          return (
            <div className="flex flex-col gap-1">
              <span>
                <pre>{row.original.sig}</pre>
              </span>
              <span className="text-sm text-secondary-foreground">
                {row.original.selector}
              </span>
              {/* We can't show for sure write functions, because sometimes the abi will specify
              "nonpayable/payable" for all functions if it couldn't determine the state */}
              <span className="text-sm text-secondary-foreground">
                {mut && (mut === 'pure' || mut === 'view') ? (
                  <Badge variant="secondary">read</Badge>
                ) : null}
              </span>
            </div>
          );
        },
      },
      {
        accessorKey: 'inputs',
        header: ({ column }) => (
          <div className="flex items-center gap-2">
            <DataTableColumnHeader column={column} title="Inputs" />
            <TooltipResponsive trigger="info" content="Function arguments" />
          </div>
        ),
        cell: ({ row }) => {
          if (loading) return <SkeletonCell />;
          const payable = row.original.stateMutability === 'payable';
          if (
            (!row.original.inputs || row.original.inputs.length === 0) &&
            !payable
          )
            return <Icons.close className="size-4 opacity-50" />;

          return (
            <div className="grid items-center gap-x-4 gap-y-2 lg:grid-cols-[auto_1fr]">
              {payable ? (
                <>
                  <Label
                    htmlFor={`${row.original.id}-value`}
                    className="flex min-w-[100px] items-center gap-2 whitespace-nowrap text-xs text-secondary-foreground sm:text-sm"
                  >
                    value ({chain.nativeCurrency.symbol})
                    <TooltipResponsive
                      trigger="info"
                      content="The value to send with the transaction (please include all decimals)"
                    />
                  </Label>
                  <Input
                    id={`${row.original.id}-value`}
                    type="text"
                    placeholder="0"
                    className="h-7 w-full max-w-xs text-xs sm:h-9 sm:text-sm"
                    value={inputValues[row.original.id]['value'] as string}
                    onFocus={() =>
                      (focusedInputRef.current = `${row.original.id}-value`)
                    }
                    onBlur={() => (focusedInputRef.current = null)}
                    autoFocus={
                      focusedInputRef.current === `${row.original.id}-value`
                    }
                    onChange={(e) =>
                      updateInputValue(row.original.id, -1, e.target.value)
                    }
                  />
                </>
              ) : null}
              {row.original.inputs?.map((input, index) => (
                <Fragment key={index}>
                  <Label
                    htmlFor={`${row.original.id}-args-${index}`}
                    className="min-w-[100px] whitespace-nowrap text-xs text-secondary-foreground sm:text-sm"
                  >
                    {input.name || `arg ${index + 1}`}
                  </Label>
                  <Input
                    id={`${row.original.id}-args-${index}`}
                    placeholder={input.type}
                    className="h-7 w-full max-w-xs text-xs sm:h-9 sm:text-sm"
                    value={
                      inputValues[row.original.id]['args'][index] as
                        | string
                        | number
                    }
                    onFocus={() =>
                      (focusedInputRef.current = `${row.original.id}-args-${index}`)
                    }
                    onBlur={() => (focusedInputRef.current = null)}
                    autoFocus={
                      focusedInputRef.current ===
                      `${row.original.id}-args-${index}`
                    }
                    onChange={(e) =>
                      updateInputValue(row.original.id, index, e.target.value)
                    }
                  />
                </Fragment>
              ))}
            </div>
          );
        },
      },
      {
        accessorKey: 'call',
        header: () => (
          <div className="flex items-center gap-2 text-xs">
            Call
            <TooltipResponsive
              trigger="info"
              content="Call the function with the arguments entered in the precedent column"
            />
          </div>
        ),
        cell: ({ row }) => {
          if (loading) return <SkeletonCell />;
          return (
            <Button
              variant="secondary"
              size="sm"
              disabled={!isCallReady[row.original.id] || processing !== ''}
              onClick={() =>
                call(
                  row.original.name,
                  row.original.inputs?.length
                    ? row.original.inputs.map((input, index) => ({
                        type: input.type,
                        name: input.name,
                        value: inputValues[row.original.id]['args'][index] as
                          | string
                          | number,
                      }))
                    : [],
                  inputValues[row.original.id]['value'],
                )
              }
            >
              {processing === row.original.id ? (
                <Icons.loading className="mr-2" />
              ) : null}
              <span className="hidden sm:inline-block">Call</span>
              <Icons.right className="inline-block size-4 sm:hidden" />
            </Button>
          );
        },
      },
    ],
    [
      loading,
      inputValues,
      processing,
      isCallReady,
      chain.nativeCurrency.symbol,
      call,
      updateInputValue,
    ],
  );

  /* ---------------------------------- DATA ---------------------------------- */
  const dataMemoized: FunctionAbi[] = useMemo(() => {
    if (loading) return Array(5).fill({});
    if (!data) return [];

    // Filter out events
    const filtered = data.filter((func) => func.type === 'function');
    // Add a unique id to each function
    const withId = filtered.map((func) => ({
      ...func,
      id: `${filtered.indexOf(func)}-${func.name}`,
    })) as FunctionAbi[];
    // Sort functions by name (ascending)
    const sorted = withId.sort((a, b) =>
      (a.name?.toLowerCase() || '') > (b.name?.toLowerCase() || '') ? 1 : -1,
    );

    // Initialize the input values for each function
    initializeInputs(sorted);

    return sorted;
  }, [data, loading, initializeInputs]);

  const table = useReactTable<FunctionAbi>({
    data: dataMemoized,
    // Below tabled (640px), aggregate the name & details columns into one
    columns: isTablet
      ? columns
      : [
          {
            ...columns[0],
            cell: ({ row }) => {
              const mut = row.original.stateMutability;

              if (loading) return <SkeletonCell />;

              return (
                <div className="flex flex-col gap-1">
                  <pre className="text-xs sm:text-sm">{row.original.name}</pre>
                  {/* We can't show for sure write functions, because sometimes the abi will specify
                  "nonpayable/payable" for all functions if it couldn't determine the state */}
                  <span>
                    {mut && (mut === 'pure' || mut === 'view') ? (
                      <Badge variant="secondary">read</Badge>
                    ) : null}
                  </span>
                </div>
              );
            },
          },
          ...columns.slice(2, columns.length),
        ],
    getCoreRowModel: getCoreRowModel(),
    // Pagination
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: 5,
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

  /* --------------------------------- RENDER --------------------------------- */
  return (
    <DataTable<FunctionAbi>
      table={table}
      pagination={dataMemoized.length > 10}
      className="rounded-none border-x border-secondary px-2"
      header={
        <div className="flex w-full items-center justify-between gap-4">
          <span className="grow font-medium">Contract interface</span>
          <div className="flex items-center py-4">
            <Input
              placeholder="Filter functions..."
              value={
                (table.getColumn('name')?.getFilterValue() as string) ?? ''
              }
              onChange={(e) =>
                table.getColumn('name')?.setFilterValue(e.target.value)
              }
              className="max-w-sm"
            />
          </div>
          <DataTableViewOptions table={table} />
        </div>
      }
    />
  );
};

export default InterfaceTable;
