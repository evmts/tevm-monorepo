import { ExpectedType, FormatTx } from './types/tx';

/**
 * @notice The prefix for Tevm local storage keys
 */
export const TEVM_PREFIX = 'TEVM_';

/* ----------------------------------- TX ----------------------------------- */
/**
 * @notice Format a transaction for the local storage
 * @dev This will format the transaction into a `TxEntry` object
 */
export const formatTx: FormatTx = (tx, context) => {
  const data =
    'data' in tx.result && tx.result.data !== undefined
      ? (tx.result.data as ExpectedType)
      : tx.result.rawData;
  // Make the data serializable for local storage (string or string[])
  const dataSerializable = Array.isArray(data)
    ? data.map((d) => d.toString())
    : data.toString();

  return {
    context,
    data: dataSerializable,
    decoded: tx.couldDecodeOutput,
    status:
      !tx.errors || tx.errors.length === 0
        ? 'success'
        : tx.errors.some((e) => e.message.includes('revert'))
          ? 'revert'
          : 'failure',
    logs: tx.result.logs || null,
    errors: tx.errors || null,
    gasUsed: tx.result.executionGasUsed.toString(),
    timestamp: Date.now(),
  };
};