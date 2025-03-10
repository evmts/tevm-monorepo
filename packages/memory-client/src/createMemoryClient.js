import { tevmDefault } from '@tevm/common'
import { requestEip1193 } from '@tevm/decorators'
import { createTevmNode } from '@tevm/node'
import { createClient, publicActions, testActions, walletActions } from 'viem'
import from "./MemoryClient.js"'
import { tevmViemActions } from './tevmViemActions.js'

/**
 * Creates a {@link MemoryClient} which is a viem client with an in-memory Ethereum client as its transport.
 * It comes batteries included with all wallet, test, public, and tevm actions.
 *
 * This function creates a fully-featured Ethereum client that runs entirely in memory, allowing you to perform
 * blockchain operations without connecting to a live network. It supports forking from existing networks,
 * different mining modes, and state persistence.
 *
 * @type {import('./CreateMemoryClientFn.js').CreateMemoryClientFn}
 * @param {import('./MemoryClientOptions.js').MemoryClientOptions} [options] - Configuration options for the memory client
 * @returns {import('./MemoryClient.js').MemoryClient} A fully initialized MemoryClient instance
 * @throws {Error} When initialization of required components fails
 *
 * @example
 * ```typescript
 * import { createMemoryClient, http } from "tevm";
 *
 * // Create a basic memory client
 * const client = createMemoryClient();
 * 
 * // Create a client that forks from Optimism mainnet
 * const forkedClient = createMemoryClient({
 *   fork: {
 *     transport: http("https://mainnet.optimism.io")({}),
 *     blockTag: 'latest'
 *   },
 * });
 *
 * // Wait for the client to be ready before using it
 * await forkedClient.tevmReady();
 * 
 * // Get the current block number
 * const blockNumber = await forkedClient.getBlockNumber();
 * console.log(blockNumber);
 * ```
 *
 * @see [Client Guide](https://tevm.sh/learn/clients/)
 * @see [Actions Guide](https://tevm.sh/learn/actions/)
 * @see [Reference Docs](https://tevm.sh/reference/tevm/memory-client/functions/creatememoryclient/)
 * @see For more information on viem clients, see the [viem client docs](https://viem.sh/docs/clients/introduction)
 *
 * ## Actions API
 *
 * MemoryClient supports the following viem actions:
 *
 * - [TEVM actions API](https://tevm.sh/reference/tevm/memory-client/type-aliases/tevmactions/)
 * ```typescript
 * import { createMemoryClient } from "tevm";
 *
 * const tevm = createMemoryClient();
 * await tevm.setAccount({ address: `0x${'01'.repeat(20)}`, balance: 100n });
 * ```
 * - [Viem public actions API](https://viem.sh/docs/actions/public/introduction) such as [getBlockNumber](https://viem.sh/docs/actions/public/getBlockNumber)
 * ```typescript
 * import { createMemoryClient } from "tevm";
 *
 * const tevm = createMemoryClient();
 * const bn = await tevm.getBlockNumber();
 * ```
 * - [Test actions](https://viem.sh/docs/actions/test/introduction) are included by default.
 * ```typescript
 * import { createMemoryClient } from "tevm";
 *
 * const tevm = createMemoryClient();
 * await tevm.setBalance({ address: `0x${'01'.repeat(20)}`, balance: 100n });
 * ```
 *
 * ## Forking
 *
 * To fork an existing network, pass an EIP-1193 transport to the `fork.transport` option with an optional block tag.
 * When you fork, TEVM will pin the block tag and lazily cache state from the fork transport.
 * It's highly recommended to pass in a `common` object that matches the chain. This will increase the performance of forking with known values.
 *
 * ```typescript
 * import { createMemoryClient, http } from "tevm";
 * import { optimism } from "tevm/common";
 *
 * const forkedClient = createMemoryClient({
 *   fork: {
 *     transport: http("https://mainnet.optimism.io")({}),
 *     blockTag: '0xa6a63cd70fbbe396321ca6fe79e1b6735760c03538208b50d7e3a5dac5226435',
 *   },
 *   common: optimism,
 * });
 * ```
 *
 * The `common` object extends the viem chain interface with EVM-specific information. When using TEVM, you should also use `tevm/common` rather than `viem/chains` or use `createCommon` and pass in a viem chain.
 *
 * Viem clients, including MemoryClient, are themselves EIP-1193 transports. This means you can fork a client with another client.
 *
 * ## Mining Modes
 *
 * TEVM supports two mining modes:
 * - Manual: Using `tevm.mine()`
 * - Auto: Automatically mines a block after every transaction.
 *
 * TEVM state does not update until blocks are mined.
 *
 * ## Using TEVM over HTTP
 *
 * TEVM can be run as an HTTP server using `@tevm/server` to handle JSON-RPC requests.
 *
 * ```typescript
 * import { createServer } from "tevm/server";
 * import { createMemoryClient } from "tevm";
 *
 * const memoryClient = createMemoryClient();
 *
 * const server = createServer({
 *   request: memoryClient.request,
 * });
 *
 * server.listen(8545, () => console.log("listening on 8545"));
 * ```
 *
 * This allows you to use any Ethereum client to communicate with it, including a viem public client.
 *
 * ```typescript
 * import { createPublicClient, http } from "viem";
 * import { mainnet } from "viem/chains";
 *
 * const publicClient = createPublicClient({
 *   chain: mainnet,
 *   transport: http("https://localhost:8545"),
 * });
 *
 * console.log(await publicClient.getChainId());
 * ```
 *
 * ## State Persistence (Experimental)
 *
 * It is possible to persist the TEVM client to a synchronous source using the `persister` option.
 *
 * ```typescript
 * import { createMemoryClient, createSyncPersister } from "tevm";
 * import { createMemoryClient } from "tevm/sync-storage-persister";
 *
 * // Client state will be hydrated and persisted from/to local storage
 * const clientWithLocalStoragePersistence = createMemoryClient({
 *   persister: createSyncPersister({
 *     storage: localStorage,
 *   }),
 * });
 * ```
 *
 * ## Network Support
 *
 * TEVM guarantees support for the following networks:
 * - Ethereum mainnet
 * - Standard OP Stack chains
 *
 * Other EVM chains are likely to work but do not officially carry support. More official chain support will be added in the near future.
 *
 * Note: Optimism deposit transactions are not currently supported but will be in a future release. TEVM filters out these transactions from blocks.
 *
 * ## Network and Hardfork Support
 *
 * TEVM supports enabling and disabling different EIPs, but the following EIPs are always turned on:
 * - 1559
 * - 4895
 * - 4844
 * - 4788
 *
 * Currently, only EIP-1559 Fee Market transactions are supported.
 *
 * ## Tree Shakeable Actions
 *
 * TEVM supports tree-shakeable actions using `createTevmNode()` and the `tevm/actions` package. If you are building a UI, you should use tree-shakeable actions to optimize bundle size. These are described in detail in the [actions API guide](https://tevm.sh/learn/actions/).
 *
 * ## Composing with TEVM Contracts and Bundler
 *
 * MemoryClient can compose with TEVM contracts and the TEVM bundler. For more information, see the [TEVM contracts guide](https://tevm.sh/learn/contracts/) and the [TEVM Solidity imports guide](https://tevm.sh/learn/solidity-imports/).
 *
 * ```typescript
 * import { createMemoryClient } from "tevm";
 * import { MyERC721 } from './MyERC721.sol';
 *
 * const tevm = createMemoryClient({
 *   fork: {
 *     transport: http("https://mainnet.optimism.io")({}),
 *   },
 * });
 *
 * const address = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045';
 *
 * await tevm.runContractCall(
 *   MyERC721.write.mint({
 *     caller: address,
 *   }),
 * );
 *
 * const balance = await tevm.runContractCall(
 *   MyERC721.read.balanceOf({
 *     caller: address,
 *   }),
 * );
 * console.log(balance); // 1n
 * ```
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
  
	// Create a TevmNode
	const node = createTevmNode({
		...options,
		...(common !== undefined ? { common } : {}),
	}).extend(requestEip1193())
  
	// Use createTevmTransport with the node
	const transport = createTevmTransport(node)
  
	const memoryClient = createClient({
		...options,
		transport: transport,
		type: 'tevm',
		...(common !== undefined ? { chain: common } : {}),
	})
		.extend(tevmViemActions())
		.extend(publicActions)
		.extend(walletActions)
		.extend(testActions({ mode: 'anvil' }))
  
	return /** @type {any} */ (memoryClient)
}
