import { ExampleContract } from './ExampleContract.sol'
import { createPublicClient, http } from 'viem'
import { optimismGoerli } from 'viem/chains'

export const publicClient = createPublicClient({
	chain: optimismGoerli,
	transport: http('https://goerli.optimism.io'),
})

const defaultOwner = '0x8f0ebdaa1cf7106be861753b0f9f5c0250fe0819'

export const readContract = (owner = defaultOwner) =>
	publicClient.readContract(
		ExampleContract.read({ chainId: optimismGoerli.id }).balanceOf(owner),
	)

if (import.meta.main) {
	readContract().then(console.log)
}
