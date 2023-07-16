import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

import { ExampleContract } from './ExampleContract.sol'

export const publicClient = createPublicClient({
  chain: mainnet,
  transport: http(mainnet.rpcUrls.public.http[0]),
})


export const ownerOf = (tokenId = BigInt(1)) => {
  return publicClient.readContract(
    ExampleContract.read().ownerOf(tokenId),
  )
}

