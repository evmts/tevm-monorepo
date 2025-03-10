import type { Address } from '@tevm/utils'
import type { Account, Chain, Client, PublicActions, TestActions, Transport, WalletActions } from 'viem'
import type { Prettify } from 'viem/chains'
import type { TevmActions } from './TevmActions.js'
import type { TevmRpcSchema } from './TevmRpcSchema.js'

/**
 * A Viem transport that connects to a TEVM node.
 *
 * The TevmTransport adds the `tevm` property to Viem's Transport, allowing direct access to the
 * underlying TEVM node. This is a custom transport used by MemoryClient and created by createTevmTransport.
 *
 * @template TTevm - The type of the TEVM node instance
 */
export type TevmTransport<TTevm = any> = Transport<'tevm', { tevm: TTevm }>

/**
 * Represents a TEVM-enhanced viem client with an in-memory Ethereum client as its transport.
 *
 * The MemoryClient provides a complete in-memory Ethereum Virtual Machine implementation with
 * a full suite of capabilities:
 *
 * - Execute contract calls directly in JavaScript with full EVM compatibility
 * - Monitor EVM execution events (steps, messages, contract creation)
 * - Deploy and interact with contracts, including direct Solidity imports
 * - Set account states, balances, nonces, and contract storage
 * - Fork from existing networks and cache remote state as needed
 * - Mine blocks manually or automatically after transactions
 * - Persist and restore state across sessions
 *
 * The client implements multiple API styles:
 * - TEVM-specific methods for direct EVM interaction
 * - Standard Ethereum JSON-RPC methods
 * - Viem-compatible wallet, test, and public actions
 *
 * @template TChain - The blockchain configuration type, extends Chain or undefined
 * @template TAccountOrAddress - The account or address type for the client
 *
 * @example
 * ```typescript
 * import { createMemoryClient, http } from "tevm";
 * import { optimism } from "tevm/common";
 * import { parseEther } from "viem";
 *
 * // Create a client forking from Optimism
 * const client = createMemoryClient({
 *   fork: {
 *     transport: http("https://mainnet.optimism.io")({}),
 *   },
 *   common: optimism,
 * });
 *
 * // Wait for the client to be ready
 * await client.tevmReady();
 *
 * // Set up account state
 * const address = "0x1234567890123456789012345678901234567890";
 * await client.tevmSetAccount({
 *   address,
 *   balance: parseEther("10")
 * });
 *
 * // Deploy a contract with events tracking
 * const deployResult = await client.tevmDeploy({
 *   bytecode: "0x608060405234801561001057600080fd5b50610150806100206000396000f3fe...",
 *   abi: [...],
 *   onStep: (step, next) => {
 *     console.log(`Executing ${step.opcode.name} at PC=${step.pc}`);
 *     next();
 *   }
 * });
 *
 * // Mine a block to confirm transactions
 * await client.mine({ blocks: 1 });
 *
 * // Get the contract address from deployment
 * console.log(`Contract deployed at: ${deployResult.createdAddress}`);
 * ```
 *
 * @see For creating a MemoryClient instance, see {@link createMemoryClient}.
 * @see [Client Guide](https://tevm.sh/learn/clients/)
 * @see [Actions Guide](https://tevm.sh/learn/actions/)
 * @see [Reference Docs](https://tevm.sh/reference/tevm/memory-client/functions/creatememoryclient/)
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
export type MemoryClient<
	TChain extends Chain | undefined = Chain | undefined,
	TAccountOrAddress extends Account | Address | undefined = Account | Address | undefined,
> = Prettify<
	Client<
		TevmTransport,
		TChain,
		TAccountOrAddress extends Account ? Account : undefined,
		TevmRpcSchema,
		TevmActions &
			PublicActions<TevmTransport, TChain, TAccountOrAddress extends Account ? Account : undefined> &
			WalletActions<TChain, TAccountOrAddress extends Account ? Account : undefined> &
			TestActions
	>
>
