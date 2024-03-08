'use client';

import { ABI, ABIFunction } from '@shazow/whatsabi/lib.types/abi';
import {
  Abi,
  CallParams,
  ContractParams,
  GetAccountResult,
  MemoryClient,
} from 'tevm';
import { Address, encodeFunctionData, Hex, isAddress } from 'tevm/utils';

import { Chain } from '@/lib/types/providers';
import { ExpectedType, TxResponse } from '@/lib/types/tx';
import { DEFAULT_ALCHEMY_API_KEY } from '@/lib/constants/defaults';
import { STANDALONE_RPC_CHAINS } from '@/lib/constants/providers';

const alchemyApiKey = process.env.ALCHEMY_API_KEY || DEFAULT_ALCHEMY_API_KEY;

/* -------------------------------------------------------------------------- */
/*                                    TYPES                                   */
/* -------------------------------------------------------------------------- */

/* -------------------------------- ACCOUNTS -------------------------------- */
/**
 * @type {Function} GetAccount
 * @param {MemoryClient} client The client to get the account from
 * @param {Address} address The address of the account
 * @returns {Promise<GetAccountResult>} The account object
 */
type GetAccount = (
  client: MemoryClient,
  address: Address,
) => Promise<GetAccountResult>;

/* ---------------------------------- CALLS --------------------------------- */
/**
 * @type {Function} CallContract
 * @param {MemoryClient} client The client to call the function on
 * @param {Address} caller The address of the caller to impersonate
 * @param {Address} contract The address of the target contract
 * @param {string} functionName The name of the function
 * @param {ABI} abi The ABI of the contract
 * @param {ExpectedType[]} args The input values to pass
 * @param {string} value The value to send with the transaction
 * @param {boolean} skipBalance Whether to skip the balance check
 * @returns {Promise<TxResponse>} The result of the transaction
 * or an unexpected error (caught in the catch block)
 */
type CallContract = (
  client: MemoryClient,
  caller: Address,
  contract: Address,
  functionName: string,
  abi: ABI,
  args: ExpectedType[],
  value: string,
  skipBalance?: boolean,
) => Promise<TxResponse>;

/**
 * @type {Function} CallWithArbitraryData
 * @param {MemoryClient} client The client to execute the call on
 * @param {Address} caller The address of the caller to impersonate
 * @param {Address} target The address of the target contract or account
 * @param {Hex} data The encoded hex data
 * @param {string} value The value to send with the transaction
 * @param {boolean} skipBalance Whether to skip the balance check
 */
type CallWithArbitraryData = (
  client: MemoryClient,
  caller: Address,
  target: Address,
  data: Hex,
  value: string,
  skipBalance?: boolean,
) => Promise<TxResponse>;

/**
 * @type {Function} HandleCall
 * @param {MemoryClient} client The client to execute the call on
 * @param {CallParams | ContractParams} params The parameters to pass for the call
 * @param {string} value The value to send with the transaction
 * @param {boolean} lowLevel Whether to use the low level call method (`Client.call`)
 * @returns {Promise<TxResponse>} The result of the transaction
 */
type HandleCall = (
  client: MemoryClient,
  params: CallParams | ContractParams,
  value: string,
  lowLevel: boolean,
) => Promise<TxResponse>;

/* --------------------------------- CLIENTS -------------------------------- */
/**
 * @type {Function} CreateClient
 * @param {number} chainId The id of the chain to create the client for
 * @param {string} forkUrl The url of the fork to use
 * @returns {Promise<MemoryClient>}
 */
type CreateClient = (chainId: number, forkUrl: string) => Promise<MemoryClient>;

/**
 * @type {Function} ResetClient
 * @param {MemoryClient} client The client to reset
 * @returns {Promise<{ success: boolean, error?: string }>}
 */
type ResetClient = (client: MemoryClient) => Promise<{
  success: boolean;
  error?: string;
}>;

/**
 * @type {Function} InitializeClient
 * @param {Chain} chain The chain to initialize a client for (using the custom fork url)
 * @returns {Promise<MemoryClient>}
 */
type InitializeClient = (chain: Chain) => Promise<MemoryClient>;

/* -------------------------------------------------------------------------- */
/*                                  FUNCTIONS                                 */
/* -------------------------------------------------------------------------- */

/* -------------------------------- ACCOUNTS -------------------------------- */
/**
 * @notice Get the account for a given address using a Tevm client
 * @dev This will return the account object for the given address.
 * @dev If the action fails, an error will be displayed and it will still return an
 * account object with the address and an error message.
 */
export const getAccount: GetAccount = async (client, address) => {
  const emptyAccount: GetAccountResult = {
    address: address ?? '0x',
    balance: BigInt(0),
    deployedBytecode: '0x',
    nonce: BigInt(0),
    storageRoot: '0x',
    codeHash: '0x',
    isContract: false,
    isEmpty: false,
    errors: [],
  };

  // Make sure the user is clearly notified if there is something wrong with the address
  if (!isAddress(address))
    return {
      ...emptyAccount,
      errors: [
        {
          _tag: 'InvalidAddressError',
          name: 'InvalidAddressError',
          message: `Invalid address: ${address}`,
        },
      ],
    };

  try {
    const accountResult = await client.getAccount({ address });
    return {
      ...accountResult,
      // This is a safeguard against an account being mislabeled as invalid
      // although very unlikely to happen
      address,
      // TODO TEMP fix until RPC providers fix their eth_getProof method
      // (some returning address(0), some returning keccak256("no data")...)
      isContract: accountResult.deployedBytecode !== '0x',
      isEmpty:
        accountResult.codeHash ===
        '0x0000000000000000000000000000000000000000000000000000000000000000',
    };
  } catch (err) {
    console.error(err);
    return {
      ...emptyAccount,
      errors: [
        {
          _tag: 'UnexpectedError',
          name: 'UnexpectedError',
          message: err instanceof Error ? err.message : 'Unknown error',
        },
      ],
    };
  }
};

/* --------------------------------- CALLS --------------------------------- */
/**
 * @notice Call a function on a given fork using its Tevm client
 * @dev This will call the function on the local fork and return the transaction hash.
 * @dev If enough information was given to decode the output (meaning an abi with actual outputs fields),
 * it will use the Tevm `Client.contract` method; otherwise it will use `Client.call` with the encoded data.
 */
export const callContract: CallContract = async (
  client,
  caller,
  contract,
  functionName,
  abi,
  args,
  value,
  skipBalance = true,
) => {
  // If the we can't define the type of the output, we won't be able to decode it
  // In this case, we just make a regular call without attempting to decode the output
  const funcObj = abi.find((f) => f.name === functionName) as
    | ABIFunction
    | undefined;
  const canDecodeOutput = funcObj?.outputs
    ? funcObj.outputs?.length > 0
    : false;

  // Base parameters for both `Client.contract` and `Client.call`
  const baseParams = {
    caller,
    to: contract,
    value: BigInt(value) ?? BigInt(0),
    createTransaction: true,
    throwOnFail: false,
    skipBalance,
  };

  // Parameters for the `Client.contract` function (or encoded data for `Client.call`)
  const dataParams = {
    functionName,
    abi: abi as Abi,
    args,
  };

  // Call with either `Client.contract` (if we can decode the output) or `Client.call`
  return canDecodeOutput
    ? await handleCall(
        client,
        Object.assign(baseParams, dataParams) satisfies ContractParams,
        value,
        false,
      )
    : await handleCall(
        client,
        {
          ...baseParams,
          data: encodeFunctionData(dataParams),
        } satisfies CallParams,
        value,
        true,
      );
};

/**
 * @notice Execute an arbitrary call on a given fork using its Tevm client
 * @dev This will attempt to execute a call given the target account or contract and the encoded data.
 */
export const callWithArbitraryData: CallWithArbitraryData = async (
  client,
  caller,
  target,
  data,
  value,
  skipBalance = true,
) => {
  return await handleCall(
    client,
    {
      caller,
      to: target,
      value: BigInt(value) ?? BigInt(0),
      data,
      createTransaction: true,
      throwOnFail: false,
      skipBalance,
    } satisfies CallParams,
    value,
    true,
  );
};

/**
 * @notice The handler for executing Tevm calls and returning expected results
 */
const handleCall: HandleCall = async (client, params, value, lowLevel) => {
  try {
    // Call with either `Client.contract` (if we can decode the output) or `Client.call`
    const callResult = lowLevel
      ? await client.call(params)
      : await client.contract(params as ContractParams);

    // Return a formatted result
    return {
      result: callResult,
      couldDecodeOutput: !lowLevel,
      errors: callResult.errors?.map((e) => ({
        title: 'Transaction failed',
        message: `${e.name}: ${e.message}`,
      })),
      value,
    };
  } catch (err) {
    console.error(err);
    // Return empty result with error
    return {
      result: {
        rawData: '0x',
        executionGasUsed: BigInt(0),
      },
      value,
      couldDecodeOutput: false,
      errors: [
        {
          title: 'Call failed',
          message: err instanceof Error ? err.message : 'Unknown error',
        },
      ],
    };
  }
};

/* --------------------------------- CLIENTS -------------------------------- */
/**
 * @notice Create a Tevm client for a given chain
 * @dev This will create a memory client with a sync storage persister, meaning that
 * the state of the client will be synced with local storage every second (default throttle).
 * @dev If there is a state saved in local storage, it will be loaded.
 * @see https://tevm.sh/learn/clients/#state-persistence
 */
export const createClient: CreateClient = async (chainId, forkUrl) => {
  const { createMemoryClient } = await import('tevm');
  const { createSyncStoragePersister } = await import(
    'tevm/sync-storage-persister'
  );

  return createMemoryClient({
    persister: createSyncStoragePersister({
      storage: localStorage,
      key: `TEVM_CLIENT_${chainId.toString()}`,
    }),
    fork: {
      url: STANDALONE_RPC_CHAINS.includes(chainId)
        ? forkUrl
        : `${forkUrl}${alchemyApiKey}`,
    },
  });
};

/**
 * @notice Reset the state of a provided Tevm client
 * @dev This will clear the underlying cache of the client, effectively resetting its state.
 */
export const resetClient: ResetClient = async (client) => {
  try {
    (await client.getVm()).stateManager.clearCaches();
    return { success: true };
  } catch (err) {
    console.error(err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error',
    };
  }
};

/**
 * @notice Initialize the client for a given chain
 * @dev This will create or load a client for this chain on first mount.
 */
export const initializeClient: InitializeClient = async (chain) =>
  await createClient(chain.id, chain.custom.rpcUrl);
