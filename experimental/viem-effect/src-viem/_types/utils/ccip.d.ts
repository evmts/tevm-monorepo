import { type CallParameters } from '../actions/public/call.js'
import type { Client } from '../clients/createClient.js'
import type { Transport } from '../clients/transports/createTransport.js'
import type { Chain } from '../types/chain.js'
import type { Hex } from '../types/misc.js'
import type { Address } from 'abitype'
export declare const offchainLookupSignature = '0x556f1830'
export declare const offchainLookupAbiItem: {
	readonly name: 'OffchainLookup'
	readonly type: 'error'
	readonly inputs: readonly [
		{
			readonly name: 'sender'
			readonly type: 'address'
		},
		{
			readonly name: 'urls'
			readonly type: 'string[]'
		},
		{
			readonly name: 'callData'
			readonly type: 'bytes'
		},
		{
			readonly name: 'callbackFunction'
			readonly type: 'bytes4'
		},
		{
			readonly name: 'extraData'
			readonly type: 'bytes'
		},
	]
}
export declare function offchainLookup<TChain extends Chain | undefined>(
	client: Client<Transport, TChain>,
	{
		blockNumber,
		blockTag,
		data,
		to,
	}: Pick<CallParameters, 'blockNumber' | 'blockTag'> & {
		data: Hex
		to: Address
	},
): Promise<Hex>
export declare function ccipFetch({
	data,
	sender,
	urls,
}: {
	data: Hex
	sender: Address
	urls: readonly string[]
}): Promise<`0x${string}`>
//# sourceMappingURL=ccip.d.ts.map
