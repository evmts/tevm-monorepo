import { tevmDefault } from '@tevm/common'
import { createClient, publicActions, testActions, walletActions } from 'viem'
import { createTevmTransport } from './createTevmTransport.js'
import { tevmViemActions } from './tevmViemActions.js'

/**
 * Creates a {@link MemoryClient} - a fully-featured Ethereum development and testing environment.
 *
 * The MemoryClient is an all-in-one solution that combines:
 * - A complete in-memory Ethereum Virtual Machine implementation
 * - Full support for viem's wallet, test, and public actions
 * - TEVM-specific actions for advanced state manipulation and tracing
 * - Automatic handling of JSON-RPC requests through viem's client interface
 *
 * This provides an integrated environment for local Ethereum development with capabilities like:
 * - Executing and debugging smart contracts without deploying to a testnet
 * - Forking from existing networks with state caching for realistic testing
 * - Direct manipulation of blockchain state for complex test scenarios
 * - Complete control over mining and transaction processing
 * - Compatibility with standard Ethereum tooling and libraries
 *
 * @type {import('./CreateMemoryClientFn.js').CreateMemoryClientFn}
 *
 * @example
 * ```typescript
 * import { createMemoryClient, http } from "tevm";
 * import { optimism } from "tevm/common";
 *
 * // Create a memory client that forks from Optimism mainnet
 * const client = createMemoryClient({
 *   fork: {
 *     transport: http("https://mainnet.optimism.io")({}),
 *   },
 *   common: optimism,
 *   mining: { auto: true }, // Automatically mine blocks after transactions
 * });
 *
 * // Wait for fork initialization to complete
 * await client.tevmReady();
 *
 * // Use standard viem actions
 * const blockNumber = await client.getBlockNumber();
 * console.log(`Connected to Optimism block ${blockNumber}`);
 *
 * // Use TEVM-specific actions
 * await client.tevmSetAccount({
 *   address: "0x123...",
 *   balance: 10000000000000000000n // 10 ETH
 * });
 * ```
 *
 * @see [Client Guide](https://tevm.sh/learn/clients/)
 * @see [Actions Guide](https://tevm.sh/learn/actions/)
 * @see [Reference Docs](https://tevm.sh/reference/tevm/memory-client/functions/creatememoryclient/)
 * @see [Viem client docs](https://viem.sh/docs/clients/introduction)
 *
 * ## Key Configuration Options
 *
 * ```typescript
 * createMemoryClient({
 *   // Chain configuration (use tevm/common chains, not viem/chains)
 *   common: optimism,
 *
 *   // Forking from an existing network
 *   fork: {
 *     transport: http("https://mainnet.optimism.io")({}),
 *     blockTag: 'latest', // or specific block number/hash
 *   },
 *
 *   // Mining configuration
 *   mining: {
 *     auto: true,      // Auto-mine after each transaction
 *     interval: 5000,  // Mine blocks every 5 seconds (in ms)
 *   },
 *
 *   // State persistence
 *   persister: createSyncPersister({
 *     storage: localStorage, // or any synchronous storage
 *   }),
 *
 *   // Chain configuration
 *   hardfork: 'prague', // Default and recommended
 *
 *   // EVM execution logging
 *   logging: {
 *     logLevel: 'debug',
 *   },
 * })
 * ```
 *
 * ## Actions API
 *
 * MemoryClient combines multiple action types in a single interface:
 *
 * ### 1. TEVM-specific actions
 * ```typescript
 * // Account and state manipulation
 * await client.tevmSetAccount({ address: "0x123...", balance: 100n });
 * await client.tevmGetAccount({ address: "0x123..." });
 *
 * // Contract interactions
 * await client.tevmContract({
 *   abi: [...],
 *   functionName: "transfer",
 *   args: ["0x456...", 1000n]
 * });
 *
 * // Contract deployment
 * const result = await client.tevmDeploy({
 *   abi: [...],
 *   bytecode: "0x...",
 *   args: ["Constructor", "Args"]
 * });
 *
 * // Mining control
 * await client.tevmMine({ blockCount: 5, interval: 10 });
 *
 * // State persistence
 * const state = await client.tevmDumpState();
 * await client.tevmLoadState(state);
 * ```
 *
 * ### 2. Viem public actions
 * ```typescript
 * const balance = await client.getBalance({ address: "0x123..." });
 * const blockNumber = await client.getBlockNumber();
 * const code = await client.getCode({ address: "0x123..." });
 * const logs = await client.getLogs({ address: "0x123..." });
 * ```
 *
 * ### 3. Viem test actions
 * ```typescript
 * await client.setBalance({ address: "0x123...", value: 100n });
 * await client.impersonateAccount({ address: "0x123..." });
 * await client.mine({ blocks: 1 });
 * await client.setStorageAt({ address, index, value });
 * ```
 *
 * ### 4. Viem wallet actions
 * ```typescript
 * const hash = await client.sendTransaction({
 *   from: "0x123...",
 *   to: "0x456...",
 *   value: 1000n
 * });
 * ```
 *
 * ## Forking Networks
 *
 * The MemoryClient can fork from any EVM-compatible network, creating a local copy that
 * lazily loads state from the remote network as needed:
 *
 * ```typescript
 * import { createMemoryClient, http } from "tevm";
 * import { optimism } from "tevm/common";
 *
 * const forkedClient = createMemoryClient({
 *   // Fork specification
 *   fork: {
 *     transport: http("https://mainnet.optimism.io")({}),
 *     blockTag: '0xa6a63cd70fbbe396321ca6fe79e1b6735760c03538208b50d7e3a5dac5226435',
 *   },
 *   // Always specify chain configuration for optimal performance
 *   common: optimism,
 * });
 * ```
 *
 * The `common` object extends the viem chain interface with EVM-specific information.
 * Always use `tevm/common` chains rather than `viem/chains` when working with TEVM.
 *
 * ## Mining Modes
 *
 * TEVM supports three mining modes:
 *
 * ```typescript
 * // 1. Manual mining (default)
 * const client = createMemoryClient({ mining: { auto: false } });
 * await client.sendTransaction(...);  // Transaction is pending
 * await client.tevmMine();            // Now transaction is processed
 *
 * // 2. Auto-mining (mine after every transaction)
 * const autoClient = createMemoryClient({ mining: { auto: true } });
 * await autoClient.sendTransaction(...);  // Automatically mined
 *
 * // 3. Interval mining (mine periodically)
 * const intervalClient = createMemoryClient({
 *   mining: { interval: 5000 }  // Mine every 5 seconds
 * });
 * ```
 *
 * ## Server Mode
 *
 * TEVM can be exposed as an HTTP JSON-RPC server with `@tevm/server`:
 *
 * ```typescript
 * import { createServer } from "tevm/server";
 * import { createMemoryClient } from "tevm";
 *
 * const memoryClient = createMemoryClient();
 * const server = createServer({
 *   request: memoryClient.request,
 * });
 *
 * server.listen(8545, () => console.log("TEVM running on port 8545"));
 * ```
 *
 * This allows any Ethereum tool or library to connect to your TEVM instance:
 *
 * ```typescript
 * import { createPublicClient, http } from "viem";
 * import { mainnet } from "viem/chains";
 *
 * const publicClient = createPublicClient({
 *   chain: mainnet,
 *   transport: http("http://localhost:8545"),
 * });
 *
 * console.log(await publicClient.getChainId());
 * ```
 *
 * ## State Persistence
 *
 * TEVM state can be persisted between sessions with the `persister` option:
 *
 * ```typescript
 * import { createMemoryClient } from "tevm";
 * import { createSyncPersister } from "tevm/sync-storage-persister";
 *
 * // Browser example with localStorage
 * const browserClient = createMemoryClient({
 *   persister: createSyncPersister({
 *     storage: localStorage,
 *     key: 'my-tevm-state'
 *   }),
 * });
 *
 * // Node.js example with file system
 * import { FileStorage } from "tevm/sync-storage-persister/node";
 * const nodeClient = createMemoryClient({
 *   persister: createSyncPersister({
 *     storage: new FileStorage('./tevm-state.json'),
 *   }),
 * });
 * ```
 *
 * ## Direct Solidity Imports
 *
 * When used with the TEVM bundler plugins, you can import Solidity files directly:
 *
 * ```typescript
 * import { createMemoryClient } from "tevm";
 * import { MyERC721 } from './MyERC721.sol';
 *
 * const client = createMemoryClient();
 *
 * // Deploy the contract
 * const deployed = await client.tevmDeploy(
 *   MyERC721.deploy("My NFT", "NFT")
 * );
 * await client.tevmMine();
 *
 * // Create contract instance with the deployed address
 * const nft = MyERC721.withAddress(deployed.createdAddress);
 *
 * // Call contract methods
 * await client.tevmContract({
 *   ...nft.write.mint('0x123...', 1),
 *   from: '0x123...',
 * });
 *
 * await client.tevmMine();
 *
 * const balance = await client.tevmContract(nft.read.balanceOf('0x123...'));
 * console.log(balance); // 1n
 * ```
 *
 * This requires setting up one of the TEVM bundler plugins (vite, webpack, esbuild, etc.).
 *
 * ## Network Support
 *
 * TEVM officially supports:
 * - Ethereum mainnet and testnets
 * - OP Stack chains (Optimism, Base, etc.)
 *
 * Other EVM chains are likely to work but not officially tested. Chain configuration
 * is available through `tevm/common`.
 *
 * ## Advanced EVM Features
 *
 * TEVM includes advanced EVM features, with the following enabled by default:
 * - EIP-1559 Fee Market
 * - EIP-4895 (Beacon chain withdrawals)
 * - EIP-4844 (Blob transactions)
 * - EIP-4788 (Beacon root in EVM)
 *
 * ## Optimizing Bundle Size
 *
 * For UI applications concerned with bundle size, use tree-shakeable actions with `createTevmNode()`
 * and individual actions from `tevm/actions`. See the [actions API guide](https://tevm.sh/learn/actions/)
 * for details.
 */
export const createMemoryClient = (options) => {
	const common = (() => {
		if (options?.common !== undefined) {
			return options.common
		}
		if (options?.fork?.transport) {
			// we don't want to return default chain if forking because we don't know chain id yet
			return undefined
		}
		// but if not forking we know common will be default
		return tevmDefault
	})()
	const memoryClient = createClient({
		...options,
		transport: createTevmTransport({
			...options,
			...(common !== undefined ? { common } : {}),
		}),
		type: 'tevm',
		...(common !== undefined ? { chain: common } : {}),
	})
		.extend(tevmViemActions())
		.extend(publicActions)
		.extend(walletActions)
		.extend(testActions({ mode: 'anvil' }))
	return /** @type {any} */ (memoryClient)
}
