import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

import { ExampleContract } from './ExampleContract.sol'
import { rpcUrls } from './constants'

export const publicClient = createPublicClient({
	chain: mainnet,
	transport: http(rpcUrls[mainnet.id]),
})

export const ownerOf = (tokenId = BigInt(1)) => {
	return publicClient.readContract(ExampleContract.read().ownerOf(tokenId))
}
