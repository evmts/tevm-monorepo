import { Common } from '@tevm/common'
import { genesisStateRoot as genMerkleGenesisStateRoot } from '@tevm/trie'
import type { GenesisState } from '@tevm/utils'

/**
 * Verkle or Merkle genesis root
 * @param genesisState
 * @param common
 * @returns
 */
export async function genGenesisStateRoot(
	genesisState: GenesisState,
	common: Common,
): Promise<Uint8Array> {
	const genCommon = common.copy()
	genCommon.setHardforkBy({
		blockNumber: 0,
		td: BigInt(genCommon.genesis().difficulty),
		timestamp: genCommon.genesis().timestamp ?? 0n,
	})
	if (genCommon.isActivatedEIP(6800)) {
		throw Error('Verkle tree state not yet supported')
	} else {
		return genMerkleGenesisStateRoot(genesisState)
	}
}
