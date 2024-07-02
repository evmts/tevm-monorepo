import { TestERC721 } from '@tevm/test-utils'
import { http, createPublicClient } from 'viem'
import { optimism } from 'viem/chains'
import { bench, expect } from 'vitest'

const TOKEN_ID = 90n

const tokenContract = TestERC721.withAddress('0x52782699900df91b58ecd618e77847c5774dcd2e')

const publicClient = createPublicClient({
	chain: optimism,
	transport: http('https://mainnet.optimism.io'),
})

bench('Ux with waterfall', async () => {
	const owner = await publicClient.readContract(tokenContract.read.ownerOf(TOKEN_ID))
	const balance = await publicClient.readContract(tokenContract.read.balanceOf(owner))
	expect(balance).toBe(13n)
})

bench('Ux with tevm fixing waterfall', async () => {
	// The Tevm compiler will allow yout o quickly write a solidity script and import it into js
	const { AvoidWaterfall } = await import('../contracts/AvoidWaterfall.s.sol')

	const balance = await publicClient.readContract({
		...AvoidWaterfall.read.balanceOfOwnerOf(tokenContract.address, TOKEN_ID),
		code: AvoidWaterfall.deployedBytecode,
	})

	expect(balance).toBe(13n)
})
