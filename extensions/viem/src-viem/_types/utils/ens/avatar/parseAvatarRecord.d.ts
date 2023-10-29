import type { Client } from '../../../clients/createClient.js'
import type { Transport } from '../../../clients/transports/createTransport.js'
import type { Chain } from '../../../types/chain.js'
import type { AssetGatewayUrls } from '../../../types/ens.js'
export declare function parseAvatarRecord<TChain extends Chain | undefined>(
	client: Client<Transport, TChain>,
	{
		gatewayUrls,
		record,
	}: {
		gatewayUrls?: AssetGatewayUrls
		record: string
	},
): Promise<string>
//# sourceMappingURL=parseAvatarRecord.d.ts.map
