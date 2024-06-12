import { type Address } from 'tevm'
import type { Hex } from 'tevm/actions'
import { encodeDeployData } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { describe, expect, it } from 'vitest'
import {
	getBlock,
	getBlockNumber,
	getChainId,
	getTransactionReceipt,
	readContract,
	sendTransaction,
} from 'wagmi/actions'
import { Fibonacci } from './fib.s.sol.js'
import { memoryClient, wagmiConfig } from './wagmiConfig.js'

// anvil[0] test account
const account = privateKeyToAccount('0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80')

describe('doStuffWithWagmi', () => {
	it(
		'should do stuff with wagmi',
		async () => {
			// chain id should be right
			expect(getChainId(wagmiConfig)).toBe(31337)

			// block number should start at 0
			expect(await getBlockNumber(wagmiConfig)).toBe(0n)

			// Should be able to send a transaction
			const hash = await sendTransaction(wagmiConfig, {
				account,
				data: encodeDeployData(Fibonacci),
				// This is a type bug in wagmi
				// https://github.com/wevm/wagmi/pull/4009
				to: undefined as any,
			})

			// if we mine a block we should then be able to fetch it
			const { blockHashes } = await memoryClient.tevmMine()
			expect(await getBlock(wagmiConfig, { blockHash: blockHashes?.[0] as Hex })).toMatchInlineSnapshot()

			// we should be able to get the receipt
			const receipt = await getTransactionReceipt(wagmiConfig, { hash })

			expect(await memoryClient.getBlockNumber()).toBe(1n)

			expect(await getBlockNumber(wagmiConfig)).toBe(1n)

			expect(
				await readContract(wagmiConfig, Fibonacci.withAddress(receipt.contractAddress as Address).read.calculate(10n)),
			).toBe(55n)
		},
		{ timeout: 20_000 },
	)
})
