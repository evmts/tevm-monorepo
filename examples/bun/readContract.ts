import { ExampleContract } from './ExampleContract.sol'
import { createPublicClient, http } from 'viem'
import { optimismGoerli } from 'viem/chains'

const addresses = {
	'1': '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
	'420': '0x1df10ec981ac5871240be4a94f250dd238b77901',
}

export const publicClient = createPublicClient({
	chain: optimismGoerli,
	transport: http('https://goerli.optimism.io'),
})

const defaultOwner = '0x8f0ebdaa1cf7106be861753b0f9f5c0250fe0819'

export const readContract = (owner = defaultOwner) =>
	publicClient.readContract({
		address: addresses[420],
		...ExampleContract.read({ chainId: optimismGoerli.id }).balanceOf(owner),
	})

if (import.meta.main) {
	readContract().then(console.log)
}
