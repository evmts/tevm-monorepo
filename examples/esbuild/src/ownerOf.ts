import { http, createPublicClient } from 'viem'
import { mainnet } from 'viem/chains'

import { ExampleContract } from './ExampleContract.sol'
import { addresses } from './addresses'
import { rpcUrls } from './constants'

export const publicClient = createPublicClient({
	chain: mainnet,
	transport: http(rpcUrls[mainnet.id]),
})

export const ownerOf = (tokenId = BigInt(1)) => {
	return publicClient.readContract({
	  ...ExampleContract.read.ownerOf(tokenId),
	  address: addresses[420]
	})
}
