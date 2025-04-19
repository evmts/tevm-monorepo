import { CallResult, ContractResult, GetAccountResult } from "tevm";
import { Log } from "tevm/actions";
import { Address } from "tevm/utils";

/* ---------------------------------- UTILS --------------------------------- */
// A type expected either as returned data by Tevm, or to be passed as input data
export type ExpectedType =
  | bigint
  | boolean
  | number
  | string
  | (bigint | boolean | number | string)[];

// An input with the correct value types for a Tevm call
export type Input = {
  name: string;
  type: string;
  value: ExpectedType;
};

// An input with the correct value types for parsing into/from local storage
export type InputStringified = {
  name: string;
  type: string;
  value: string | string[];
};

/* --------------------------------- OBJECTS -------------------------------- */
/**
 * @type {Object} TevmResult
 * @notice The result of a call, as returned by Tevm with either `Client.contract` or `Client.call`
 */
type TevmResult = CallResult | ContractResult;

/**
 * @type {Object} TxError
 * @notice An error that occurred during the call or on the app when processing the call
 * @property {string} title The title of the error
 * @property {string} message The message of the error
 * @dev This will wrap any Tevm error or app error that occurred during the call
 */
type TxError = {
  title: string;
  message: string;
};

/**
 * @type {Object} TxResponse
 * @notice The result of a call, as returned by Tevm with either `Client.contract` or `Client.call`
 * @dev This will contain the call result as returned by Tevm, along with additional information.
 * @dev This can also be the object returned from the catch block.
 * @property {TevmResult} result The result of the call
 * @property {boolean} couldDecodeOutput Whether the output could be decoded or not
 * @property {string} value The value initially sent with the transaction
 * @property {TxError[] | undefined} errors The errors that occurred during the call; either Tevm errors or app errors
 * formatted as `TxError` for consistency
 */
export type TxResponse = {
  result: TevmResult;
  couldDecodeOutput: boolean;
  value: string;
  errors?: TxError[];
};

/**
 * @type {Object} TxContext
 * @notice The context of a transaction (for the local storage)
 * @property {number} chainId The id of the chain the transaction was made on
 * @property {GetAccountResult} target The account targeted by the transaction (contract or EOA)
 * @property {Address} caller The address of the impersonated caller
 * @property {string} functionName The name of the function called; undefined if low level call
 * @property {InputStringified[]} inputValues The input values passed to the function (as strings)
 * @property {string} value The value sent with the transaction
 */
type TxContext = {
  chainId: number;
  target: GetAccountResult;
  caller: Address;
  functionName: string | undefined;
  inputValues: InputStringified[];
  value: string;
};

/**
 * @type {Object} TxEntry
 * @notice The entry of a transaction in the local storage
 * @property {number} id The id of the transaction (auto-incremented)
 * @property {TxContext} context The context of the transaction (chain, target, caller, function)
 * @property {string} data The data returned by the call, either decoded or raw (hex)
 * @property {boolean} decoded Whether the data is decoded or not
 * @property {boolean} success Whether the call was successful
 * @property {TxError[] | null} errors The errors that occurred during the call
 * @property {number} gasUsed The amount of gas used by the call
 * @property {number} timestamp The timestamp of the transaction (when it was saved)
 */
export type TxEntry = {
  id: number;
  // Input/details
  context: TxContext;
  // Output
  data: string | string[];
  decoded: boolean;
  status: "success" | "revert" | "failure";
  logs: Log[] | null;
  errors: TxError[] | null;
  gasUsed: string;
  timestamp: number;
};

/* -------------------------------- FUNCTIONS ------------------------------- */
/**
 * @type {Function} SaveTx
 * @param {TxEntry} entry The transaction to save along with its context
 */
export type SaveTx = (entry: Omit<TxEntry, "id">) => void;

/**
 * @type {Function} FormatTx
 * @param {TxResponse} tx The transaction to format
 * @param {TxContext} context The context of the transaction
 * @returns {TxEntry} The formatted transaction
 */
export type FormatTx = (
  tx: TxResponse,
  context: TxContext,
) => Omit<TxEntry, "id">;
