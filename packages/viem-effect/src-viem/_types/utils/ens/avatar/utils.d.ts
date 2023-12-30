import type { Client } from '../../../clients/createClient.js'
import type { Transport } from '../../../clients/transports/createTransport.js'
import type { Chain } from '../../../types/chain.js'
import type { AssetGatewayUrls } from '../../../types/ens.js'
import type { Address } from 'abitype'
type UriItem = {
	uri: string
	isOnChain: boolean
	isEncoded: boolean
}
export declare function isImageUri(uri: string): Promise<unknown>
export declare function getGateway(
	custom: string | undefined,
	defaultGateway: string,
): string
export declare function resolveAvatarUri({
	uri,
	gatewayUrls,
}: {
	uri: string
	gatewayUrls?: AssetGatewayUrls | undefined
}): UriItem
export declare function getJsonImage(data: any): any
export declare function getMetadataAvatarUri({
	gatewayUrls,
	uri,
}: {
	gatewayUrls?: AssetGatewayUrls | undefined
	uri: string
}): Promise<string>
export declare function parseAvatarUri({
	gatewayUrls,
	uri,
}: {
	gatewayUrls?: AssetGatewayUrls | undefined
	uri: string
}): Promise<string>
type ParsedNft = {
	chainID: number
	namespace: string
	contractAddress: Address
	tokenID: string
}
export declare function parseNftUri(uri_: string): ParsedNft
export declare function getNftTokenUri<TChain extends Chain | undefined>(
	client: Client<Transport, TChain>,
	{
		nft,
	}: {
		nft: ParsedNft
	},
): Promise<string>
export {}
//# sourceMappingURL=utils.d.ts.map
