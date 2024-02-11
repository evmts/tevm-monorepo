import type { TevmClient } from '@tevm/client-types'
import { type CreateEVMOptions, createMemoryClient } from '@tevm/memory-client'
import type {
	EthJsonRpcRequest,
	TevmJsonRpcRequest,
} from '@tevm/procedures-types'
import {
	type BigNumberish,
	type BytesLike,
	JsonRpcApiProvider,
	type JsonRpcError,
	type JsonRpcResult,
	type Numeric,
} from 'ethers'

export interface AccountState {
	balance?: BigNumberish
	code?: BytesLike
	nonce?: Numeric
}

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
	static readonly createMemoryProvider = async (options: CreateEVMOptions) => {
		return new TevmProvider(await createMemoryClient(options))
	}

	constructor(
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
		public readonly tevm: TevmClient,
	) {
		super()
	}

	/**
	 *  Sends a JSON-RPC %%payload%% (or a batch) to the underlying tevm instance.
	 */
	public readonly _send: JsonRpcApiProvider['_send'] = async (payload) => {
		if (Array.isArray(payload)) {
			return this.tevm.requestBulk(
				payload as Array<TevmJsonRpcRequest | EthJsonRpcRequest>,
			) as Promise<Array<JsonRpcResult | JsonRpcError>>
		} else {
			return [
				await this.tevm.request(
					payload as TevmJsonRpcRequest | EthJsonRpcRequest,
				),
			] as [JsonRpcResult | JsonRpcError]
		}
	}
}
