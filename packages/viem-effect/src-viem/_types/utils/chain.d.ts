import type { Chain, ChainConfig, ChainFormatters } from '../types/chain.js'
import type { Assign } from '../types/utils.js'
export type AssertCurrentChainParameters = {
	chain?: Chain
	currentChainId: number
}
export declare function assertCurrentChain({
	chain,
	currentChainId,
}: AssertCurrentChainParameters): void
export declare function defineChain<
	const chain extends Chain,
	formatters extends ChainFormatters,
>(
	chain: chain,
	config?: ChainConfig<formatters>,
): Assign<chain, ChainConfig<formatters>>
export declare function getChainContractAddress({
	blockNumber,
	chain,
	contract: name,
}: {
	blockNumber?: bigint
	chain: Chain
	contract: string
}): `0x${string}`
//# sourceMappingURL=chain.d.ts.map
