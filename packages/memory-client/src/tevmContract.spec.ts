import { optimism } from '@tevm/common'
import { SimpleContract } from '@tevm/contract'
import { requestEip1193 } from '@tevm/decorators'
import { createTevmNode } from '@tevm/node'
import { transports } from '@tevm/test-utils'
import { type Client, createClient } from 'viem'
import { beforeEach, describe, expect, it } from 'vitest'
import type { TevmTransport } from './TevmTransport.js'
import { createTevmTransport } from './createTevmTransport.js'
import { tevmContract } from './tevmContract.js'
import { tevmSetAccount } from './tevmSetAccount.js'

let client: Client<TevmTransport>
const contractAddress = '0x0000000000000000000000000000000000000000'
const contract = SimpleContract.withAddress(contractAddress)

beforeEach(async () => {
	const node = createTevmNode({
		fork: { transport: transports.optimism },
	}).extend(requestEip1193())
	
	client = createClient({
		transport: createTevmTransport(node),
		chain: optimism,
	})

	await tevmSetAccount(client, {
		address: contractAddress,
		deployedBytecode: SimpleContract.deployedBytecode,
	})
})

describe('tevmContract', () => {
	it('should execute a basic contract call', async () => {
		const result = await tevmContract(client, contract.read.get())
		expect(result).toBeDefined()
		expect(result.rawData).toBeDefined()
	})

	it('should handle contract call with arguments', async () => {
		const result = await tevmContract(client, contract.write.set(42n))
		expect(result).toBeDefined()
		expect(result.rawData).toBeDefined()
	})

	it('should handle contract call with transaction creation', async () => {
		const result = await tevmContract(client, {
			...contract.write.set(42n),
			createTransaction: true,
		})
		expect(result).toBeDefined()
		expect(result.rawData).toBeDefined()
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
		expect(result.rawData).toBeDefined()
	})
})
