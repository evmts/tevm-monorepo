import { describe, it, expect } from 'vitest'
import { memoryClient, wagmiConfig } from './wagmiConfig.js'
import { call, getBlockNumber, getChainId, readContract } from 'wagmi/actions'
import { privateKeyToAccount } from 'viem/accounts'
import { encodeDeployData } from 'viem'
import { Fibonacci } from './fib.s.sol'

// anvil[0] test account
const account = privateKeyToAccount('0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80')

describe('doStuffWithWagmi', () => {
	it('should do stuff with wagmi', async () => {
		expect(getChainId(wagmiConfig)).toBe(31337)
		expect(getBlockNumber(wagmiConfig)).toBe(0n)
		const deployResult = await call(wagmiConfig, {
			account,
			data: encodeDeployData(Fibonacci),
		})
		expect(deployResult).toBeDefined()

		await memoryClient.tevmMine()

		expect(getBlockNumber(wagmiConfig)).toBe(1n)

		expect(await readContract(wagmiConfig, Fibonacci.read.calculate(10n))).toBe(55n)
	})
})
