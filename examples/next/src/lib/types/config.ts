import { ABIFunction } from '@shazow/whatsabi/lib.types/abi';
import { GetAccountError } from '@tevm/errors';

import { Chain, Client } from '@/lib/types/providers';

/**
 * @type {`0x${string}`} Address
 * @notice A valid Ethereum address (after checksum verification)
 */
export type Address = `0x${string}`;

/**
 * @type {`0x${string}`} Hex
 * @notice A valid hexadecimal string
 */
export type Hex = `0x${string}`;

/**
 * @type {Object} Account
 * @notice Either a contract or an account, with the result of Tevm `Client.getAccount`
 * @param {Address} address The address of the account
 * @param {bigint} balance The balance of the account in native tokens
 * @param {Hex} deployedBytecode The deployed bytecode of the account if it's a contract
 * @param {bigint} nonce The nonce of the account
 * @param {boolean} isContract Whether the account is a contract or not
 * @param {boolean} isEmpty Whether the account is empty or not (can indicate an uninitialized account)
 * @param {GetAccountError[]} errors Any errors that occurred when retrieving the state of the account
 */
export type Account = {
  address: Address;
  balance: bigint | string; // string for local storage
  deployedBytecode: Hex;
  nonce: bigint | string; // string for local storage
  isContract: boolean;
  isEmpty: boolean;
  errors?: GetAccountError[];
};

/**
 * @type {Object} FunctionAbi
 * @notice Returned from WhatsABI and formatted (keep only function + add unique id)
 * @dev We made sure to get a name for any function (at the very worst `function-${index}`)
 * @param {ABIFunction} The base function's ABI from WhatsABI
 * @param {string} id A unique identifier for the function
 * @param {string} name Either the name of the function, selector or a unique identifier
 */
export type FunctionAbi = ABIFunction & {
  id: string;
  // We made sure to get a name for any function (at the very worst `function-${index}`)
  name: string;
};

/**
 * @type {Object} UpdateAccountOptions
 * @notice Options for updating the account state (optional)
 * @param {boolean} updateAbi Whether to attempt to fetch/refetch the ABI at the provided address
 * @param {Chain} chain The chain to target for the abi retrieval
 * @param {Client} client The client to use for the account state
 */
export type UpdateAccountOptions = {
  updateAbi: boolean;
  chain: Chain;
  client: Client;
};
