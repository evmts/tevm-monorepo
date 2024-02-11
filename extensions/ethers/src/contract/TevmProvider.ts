import type { TevmClient } from '@tevm/client-types'
import { JsonRpcApiProvider } from 'ethers'
import type { BigNumberish, BytesLike, JsonRpcPayload, Numeric } from 'ethers'
import type { Networkish } from 'ethers'
import type { JsonRpcApiProviderOptions } from 'ethers'

export interface AccountState {
	balance?: BigNumberish
	code?: BytesLike
	nonce?: Numeric
}

let hasWarned = false

export class TevmProvider extends JsonRpcApiProvider {

	constructor(
		/**
		 * An isntance of the Tevm VM (or interface that implements the same API)
		 */
		public readonly tevm: TevmClient,
		network?: Networkish,
		options?: JsonRpcApiProviderOptions,
	) {
		super(network, options)
	}

	/**
	 *  Sends a JSON-RPC %%payload%% (or a batch) to the underlying channel.
	 *
	 *  Sub-classes **MUST** override this.
	 */
	public readonly _send: JsonRpcApiProvider['_send'] = async (payload) => {
		if (Array.isArray(payload)) {
			const results = await this.tevm.requestBulk(payload)
			return results.map((res, i) => {
				const req = payload[i]
				if (!req) {
					// just making strict typescript happy this will never happen
					throw new Error('Unexpected missing response')
				}
				return {
					...res,
					result: req.method === 'eth_call' ? (res.result as CallResult).rawData : res.result,
					// Make sure method always matches if we modified it with tevm_* in `prepareRequest`
					method: req.method,
					id: req.id,
				}
			})
		} else {
			const res = await this.tevm.request(this.prepareRequest(payload) as any)
			return [{
				...res,
				result: payload.method === 'eth_call' ? (res.result as CallResult).rawData : res.result,
				// Make sure method always matches if we modified it with tevm_* in `prepareRequest`
				method: payload.method,
				id: payload.id,
			}]
		}
	}
}
