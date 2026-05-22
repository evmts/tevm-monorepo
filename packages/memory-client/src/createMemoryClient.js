import { createCommon, tevmDefault } from '@tevm/common'
import { createClient, publicActions, testActions, walletActions } from 'viem'
import { createTevmTransport } from './createTevmTransport.js'
import { tevmViemActions } from './tevmViemActions.js'

/**
 * Creates a {@link MemoryClient} - a fully-featured Ethereum development and testing environment.
 *
 * Combines an in-memory EVM with viem's wallet/test/public actions and TEVM-specific actions
 * for state manipulation, tracing, mining, and forking.
 *
 * @type {import('./CreateMemoryClientFn.js').CreateMemoryClientFn}
 *
 * @example
 * ```typescript
 * import { createMemoryClient, http } from "tevm";
 * import { optimism } from "tevm/common";
 *
 * const client = createMemoryClient({
 *   fork: { transport: http("https://mainnet.optimism.io")({}) },
 *   common: optimism,
 *   miningConfig: { type: 'auto' },
 * });
 *
 * await client.tevmReady();
 * const blockNumber = await client.getBlockNumber();
 * await client.tevmSetAccount({ address: "0x123...", balance: 10n ** 19n });
 * ```
 *
 * @see [Client Guide](https://tevm.sh/learn/clients/)
 * @see [Actions Guide](https://tevm.sh/learn/actions/)
 * @see [Reference Docs](https://tevm.sh/reference/tevm/memory-client/functions/creatememoryclient/)
 *
 * @param {import('./MemoryClientOptions.js').MemoryClientOptions} [options] - The options to configure the MemoryClient.
 */
export const createMemoryClient = /** @type {import('./CreateMemoryClientFn.js').CreateMemoryClientFn} */ (
	/** @param {any} options */
	(options) => {
		const miningConfig = (() => {
			if (options?.miningConfig !== undefined) {
				return options.miningConfig
			}
			const mining = options?.mining
			if (mining === undefined) {
				return undefined
			}
			if (typeof mining.interval === 'number') {
				return { type: 'interval', blockTime: mining.interval / 1000 }
			}
			if (typeof mining.auto === 'boolean') {
				return { type: mining.auto ? 'auto' : 'manual' }
			}
			return undefined
		})()
		const normalizedOptions = {
			...options,
			...(miningConfig !== undefined ? { miningConfig } : {}),
		}
		const common = (() => {
			if (normalizedOptions?.common !== undefined) {
				return normalizedOptions.common
			}
			if (normalizedOptions?.fork?.transport) {
				// we don't want to return default chain if forking because we don't know chain id yet
				return undefined
			}
			// but if not forking we know common will be default
			return tevmDefault
		})()
		const chain = (() => {
			if (common === undefined) {
				return undefined
			}
			if (normalizedOptions?.fork?.chainId === undefined) {
				return common
			}
			return createCommon({
				...common,
				id: normalizedOptions.fork.chainId,
				loggingLevel: normalizedOptions.loggingLevel ?? 'warn',
				hardfork: common.ethjsCommon.hardfork() ?? 'prague',
				eips: common.ethjsCommon.eips(),
				customCrypto: common.ethjsCommon.customCrypto,
			})
		})()
		const memoryClient = createClient({
			...normalizedOptions,
			cacheTime: normalizedOptions.cacheTime ?? 0,
			transport: createTevmTransport(
				/** @type {import('@tevm/node').TevmNodeOptions} */ ({
					...normalizedOptions,
					...(chain !== undefined ? { common: chain } : {}),
				}),
			),
			type: 'tevm',
			...(chain !== undefined ? { chain } : {}),
		})
			.extend(
				/** @type {(client: import('viem').Client<import('viem').Transport, undefined, undefined>) => import('./TevmViemActionsApi.js').TevmViemActionsApi} */ (
					tevmViemActions()
				),
			)
			.extend(publicActions)
			.extend(walletActions)
			.extend(testActions({ mode: 'anvil' }))
		return /** @type {any} */ (memoryClient)
	}
)
