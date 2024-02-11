import { createMemoryClient } from '@tevm/memory-client'
import { JsonRpcApiProvider } from 'ethers'

/**
 * An instance of the Tevm interface.
 * @see {@link https://tevm.sh/learn/clients/ | Tevm Clients Docs}
 * @example
 * ```ts
 * import { createHttpClient } from '@tevm/http-client''
 *
 * const tevm = await createHttpClient({ url: 'http://localhost:8545' })
 *
 * const provider = new TevmProvider(tevm)
 *
 * const blockNumber = await provider.getBlockNumber()
 * ```
 */
export class TevmProvider extends JsonRpcApiProvider {
	/**
	 * Creates a new TevmProvider instance with a TevmMemoryClient.
	 * @param {import('@tevm/memory-client').CreateEVMOptions} options - Options to create a new TevmProvider.
	 * @returns {Promise<TevmProvider>} A new TevmProvider instance.
	 * @readonly
	 * @see {@link https://tevm.sh/learn/clients/ | Tevm Clients Docs}
	 * @example
	 * ```ts
	 * import { TevmProvider } from '@tevm/ethers'
	 *
	 * const provider = await TevmProvider.createMemoryProvider()
	 *
	 * const blockNumber = await provider.getBlockNumber()
	 * ```
	 */
	static createMemoryProvider = async (options) => {
		return new TevmProvider(await createMemoryClient(options))
	}

	/**
	 * @type {import('@tevm/client-types').TevmClient}
	 */
	tevm

	/**
	 * An instance of the Tevm interface.
	 * @see {@link https://tevm.sh/learn/clients/ | Tevm Clients Docs}
	 * @example
	 * ```ts
	 * import { createHttpClient } from '@tevm/http-client''
	 *
	 * const tevm = await createHttpClient({ url: 'http://localhost:8545' })
	 *
	 * const provider = new TevmProvider(tevm)
	 *
	 * const blockNumber = await provider.getBlockNumber()
	 * ```
	 * @param {import('@tevm/client-types').TevmClient} tevm An instance of the Tevm interface.
	 */
	constructor(tevm) {
		super()
		this.tevm = tevm
	}

	/**
	 *  Sends a JSON-RPC %%payload%% (or a batch) to the underlying tevm instance.
	 *  @type {import('ethers').JsonRpcApiProvider['_send']}
	 */
	_send = async (payload) => {
		if (Array.isArray(payload)) {
			return /** @type {Promise<Array<import('ethers').JsonRpcResult | import('ethers').JsonRpcError>>}*/ (
				this.tevm.requestBulk(
					/** @type {Array<import('@tevm/procedures-types').TevmJsonRpcRequest | import('@tevm/procedures-types').EthJsonRpcRequest>}*/ (
						payload
					),
				)
			)
		} else {
			return /** @type {[import('ethers').JsonRpcResult | import('ethers').JsonRpcError]}*/ ([
				await this.tevm.request(
					/** @type {import('@tevm/procedures-types').TevmJsonRpcRequest | import('@tevm/procedures-types').EthJsonRpcRequest}*/ (
						payload
					),
				),
			])
		}
	}
}
