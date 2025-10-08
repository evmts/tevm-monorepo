import { SimpleContract } from '@tevm/contract'
import { SimpleContract as SimpleContractUtils } from '@tevm/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import { createMemoryClient } from './createMemoryClient.js'
import type { MemoryClient } from './MemoryClient.js'
import { tevmContract } from './tevmContract.js'

let client: MemoryClient
const contractAddress = '0x0000000000000000000000000000000000000000'
const contract = SimpleContractUtils.withAddress(contractAddress)

beforeEach(async () => {
	client = createMemoryClient()
	await client.tevmReady()

	await client.tevmSetAccount({
		address: contractAddress,
		deployedBytecode: SimpleContractUtils.deployedBytecode,
	})
})

describe('tevmContract', () => {
	it('should execute a basic contract call', async () => {
		const result = await tevmContract(client, contract.read.get())
		expect(result).toBeDefined()
		expect(result.rawData).toBeHex()
	})

	it('should handle contract call with arguments', async () => {
		const result = await tevmContract(client, contract.write.set(42n))
		expect(result).toBeDefined()
		expect(result.rawData).toBeHex()
	})

	it('should handle contract call with transaction creation', async () => {
		const result = await tevmContract(client, {
			...contract.write.set(42n),
			createTransaction: true,
		})
		expect(result).toBeDefined()
		expect(result.rawData).toBeHex()
		expect(result.txHash).toBeHex()
	})

	it('should handle errors gracefully', async () => {
		const invalidAddress = '0xinvalid'
		try {
			await tevmContract(client, {
				to: invalidAddress,
				abi: SimpleContract.abi,
				functionName: 'get',
			})
		} catch (error) {
			expect(error).toBeDefined()
		}
	})

	it('should handle contract call with custom sender', async () => {
		const senderAddress = '0x0000000000000000000000000000000000000001'
		const result = await tevmContract(client, {
			...contract.write.set(42n),
			from: senderAddress,
		})
		expect(result).toBeDefined()
		expect(result.rawData).toBeHex()
	})
})
