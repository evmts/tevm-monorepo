import type { Common } from '@tevm/common'
import type { Address } from '@tevm/utils'
import { type Account, type Chain, type RpcSchema } from 'viem'
import type { MemoryClient } from './MemoryClient.js'
import type { MemoryClientOptions } from './MemoryClientOptions.js'
import type { TevmRpcSchema } from './TevmRpcSchema.js'

/**
 * Type definition for the function that creates a {@link MemoryClient}.
 *
 * This function type represents `createMemoryClient`, which initializes a complete in-memory Ethereum
 * virtual machine with a comprehensive API. The function supports extensive configuration options for:
 *
 * - Network forking from live Ethereum networks
 * - Custom chain settings and EVM parameters
 * - Mining behavior configuration
 * - State persistence
 * - Logging and debugging settings
 * - Custom account injection
 *
 * The returned client integrates with viem's action system while providing TEVM-specific
 * capabilities for more advanced EVM interaction.
 *
 * @template TCommon - The common chain configuration, extending both `Common` and `Chain`.
 * @template TAccountOrAddress - The account or address type for the client.
 * @template TRpcSchema - The RPC schema type, defaults to `TevmRpcSchema`.
 *
 * @param {MemoryClientOptions<TCommon, TAccountOrAddress, TRpcSchema>} [options] - The options to configure the MemoryClient.
 * @returns {Promise<MemoryClient<TCommon, TAccountOrAddress>>} - A Promise resolving to a configured MemoryClient instance.
 * @throws {Error} When configuration is invalid or initialization fails.
 *
 * @example
 * ```typescript
 * import { createMemoryClient, http } from "tevm";
 * import { optimism } from "tevm/common";
 * import { parseEther } from "viem";
 *
 * // Basic client with default settings
 * const basicClient = await createMemoryClient();
 *
 * // Advanced client with custom configuration
 * const client = await createMemoryClient({
 *   // Fork from Optimism mainnet
 *   fork: {
 *     transport: http("https://mainnet.optimism.io")({}),
 *     blockTag: 'latest', // Or specific block hash/number
 *   },
 *   // Use Optimism chain configuration
 *   common: optimism,
 *   // Enable auto-mining (blocks mined after each transaction)
 *   miningConfig: {
 *     type: 'auto'
 *   },
 *   // Set client metadata
 *   name: 'Optimism Development Client',
 *   // Configure performance
 *   pollingInterval: 1000,
 *   // Modify EVM behavior
 *   allowUnlimitedContractSize: true,
 *   // Set logging verbosity
 *   loggingLevel: 'debug'
 * });
 *
 * // Initialize and configure client
 * await client.tevmReady();
 *
 * // Set up test account
 * await client.tevmSetAccount({
 *   address: '0x1234567890123456789012345678901234567890',
 *   balance: parseEther('100'),
 *   nonce: 0n
 * });
 *
 * // Read from forked network
 * const balance = await client.getBalance({
 *   address: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045'
 * });
 * ```
 *
 * @see {@link MemoryClient} - For the return type of this function
 * @see {@link MemoryClientOptions} - For detailed configuration options
 * @see [Client Guide](https://tevm.sh/learn/clients/) - Complete documentation
 */
export type CreateMemoryClientFn = <
	TCommon extends Common & Chain = Common & Chain,
	TAccountOrAddress extends Account | Address | undefined = undefined,
	TRpcSchema extends RpcSchema | undefined = TevmRpcSchema,
>(
	options?: MemoryClientOptions<TCommon, TAccountOrAddress, TRpcSchema>,
) => Promise<MemoryClient<TCommon, TAccountOrAddress>>
