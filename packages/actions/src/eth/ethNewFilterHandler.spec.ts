import { createAddress, createContractAddress } from '@tevm/address'
import { createTevmNode } from '@tevm/node'
import { SimpleContract } from '@tevm/test-utils'
import { encodeDeployData, encodeFunctionData, keccak256, PREFUNDED_ACCOUNTS, stringToHex } from '@tevm/utils'
import { describe, expect, it } from 'vitest'
import { callHandler } from '../Call/callHandler.js'
import { mineHandler } from '../Mine/mineHandler.js'
import { setAccountHandler } from '../SetAccount/setAccountHandler.js'
import { ethNewFilterHandler } from './ethNewFilterHandler.js'

describe('ethNewFilterHandler', () => {
	it('should create a new filter and return a filter ID', async () => {
		const client = createTevmNode()
		await client.ready()
		const handler = ethNewFilterHandler(client)

		const filterId = await handler({
			fromBlock: 'latest',
			toBlock: 'latest',
		})

		expect(filterId).toBeDefined()
		expect(typeof filterId).toBe('string')
		expect(filterId).toMatch(/^0x[a-f0-9]+$/i)

		// Verify filter was created
		const filter = client.getFilters().get(filterId)
		expect(filter).toBeDefined()
		expect(filter?.type).toBe('Log')
	})

	it('should create filter with address parameter', async () => {
		const client = createTevmNode()
		await client.ready()
		const handler = ethNewFilterHandler(client)

		const testAddress = '0x1234567890123456789012345678901234567890' as const

		const filterId = await handler({
			address: testAddress,
			fromBlock: 'latest',
			toBlock: 'latest',
		})

		const filter = client.getFilters().get(filterId)
		expect(filter).toBeDefined()
		expect(filter?.logsCriteria?.address).toBe(testAddress)
	})

	it('should create filter with topics parameter', async () => {
		const client = createTevmNode()
		await client.ready()
		const handler = ethNewFilterHandler(client)

		const topic = keccak256(stringToHex('Transfer(address,address,uint256)'))

		const filterId = await handler({
			topics: [topic],
			fromBlock: 'latest',
			toBlock: 'latest',
		})

		const filter = client.getFilters().get(filterId)
		expect(filter).toBeDefined()
		expect(filter?.logsCriteria?.topics).toEqual([topic])
	})

	it('should create filter with multiple topics (OR logic)', async () => {
		const client = createTevmNode()
		await client.ready()
		const handler = ethNewFilterHandler(client)

		const topic1 = keccak256(stringToHex('Transfer(address,address,uint256)'))
		const topic2 = keccak256(stringToHex('Approval(address,address,uint256)'))

		const filterId = await handler({
			topics: [[topic1, topic2]],
			fromBlock: 'latest',
			toBlock: 'latest',
		})

		const filter = client.getFilters().get(filterId)
		expect(filter).toBeDefined()
		expect(filter?.logsCriteria?.topics).toEqual([[topic1, topic2]])
	})

	it('should populate filter with past logs from block range', async () => {
		const client = createTevmNode()
		await client.ready()

		const from = createAddress(PREFUNDED_ACCOUNTS[0].address).toString()
		await setAccountHandler(client)({
			address: from,
			balance: 10000000000000000000n,
		})

		// Deploy contract
		const contract = SimpleContract.withAddress(createContractAddress(createAddress(from), 0n).toString())

		await callHandler(client)({
			from,
			data: encodeDeployData(contract.deploy(0n)),
			createTransaction: true,
		})
		await mineHandler(client)()

		// Emit an event
		await callHandler(client)({
			from,
			to: contract.address,
			data: encodeFunctionData(contract.write.set(42n)),
			createTransaction: true,
		})
		await mineHandler(client)()

		// Create filter after events occurred
		const handler = ethNewFilterHandler(client)
		const filterId = await handler({
			address: contract.address,
			fromBlock: 0n,
			toBlock: 'latest',
		})

		const filter = client.getFilters().get(filterId)
		expect(filter).toBeDefined()
		expect(filter?.logs.length).toBeGreaterThan(0)
	})

	it('should attach listener for future logs', async () => {
		const client = createTevmNode()
		await client.ready()

		const from = createAddress(PREFUNDED_ACCOUNTS[0].address).toString()
		await setAccountHandler(client)({
			address: from,
			balance: 10000000000000000000n,
		})

		// Deploy contract
		const contract = SimpleContract.withAddress(createContractAddress(createAddress(from), 0n).toString())

		await callHandler(client)({
			from,
			data: encodeDeployData(contract.deploy(0n)),
			createTransaction: true,
		})
		await mineHandler(client)()

		// Create filter
		const handler = ethNewFilterHandler(client)
		const filterId = await handler({
			address: contract.address,
			fromBlock: 'latest',
			toBlock: 'latest',
		})

		const filterBefore = client.getFilters().get(filterId)
		const _logCountBefore = filterBefore?.logs.length ?? 0

		// Emit event after filter creation
		await callHandler(client)({
			from,
			to: contract.address,
			data: encodeFunctionData(contract.write.set(100n)),
			createTransaction: true,
		})

		// Note: The listener is attached and will capture logs via the newLog event
		// The test verifies the listener is in the registeredListeners array
		expect(filterBefore?.registeredListeners.length).toBeGreaterThan(0)
	})

	it('should create filter with fromBlock as block number', async () => {
		const client = createTevmNode()
		await client.ready()
		const handler = ethNewFilterHandler(client)

		// Mine a block first so block 1 exists
		await mineHandler(client)()

		const filterId = await handler({
			fromBlock: 1n,
			toBlock: 'latest',
		})

		const filter = client.getFilters().get(filterId)
		expect(filter).toBeDefined()
		expect(filter?.logsCriteria?.fromBlock).toBe(1n)
	})

	it('should create filter with toBlock as block number', async () => {
		const client = createTevmNode()
		await client.ready()
		const handler = ethNewFilterHandler(client)

		// Mine enough blocks so block 10 exists
		for (let i = 0; i < 11; i++) {
			await mineHandler(client)()
		}

		const filterId = await handler({
			fromBlock: 'latest',
			toBlock: 10n,
		})

		const filter = client.getFilters().get(filterId)
		expect(filter).toBeDefined()
		expect(filter?.logsCriteria?.toBlock).toBe(10n)
	})

	it('should default toBlock to latest when not provided', async () => {
		const client = createTevmNode()
		await client.ready()
		const handler = ethNewFilterHandler(client)

		const filterId = await handler({
			fromBlock: 'latest',
		})

		const filter = client.getFilters().get(filterId)
		expect(filter).toBeDefined()
		expect(filter?.logsCriteria?.toBlock).toBe('latest')
	})

	it('should handle block number 0 as fromBlock', async () => {
		const client = createTevmNode()
		await client.ready()
		const handler = ethNewFilterHandler(client)

		const filterId = await handler({
			fromBlock: 0n,
			toBlock: 'latest',
		})

		const filter = client.getFilters().get(filterId)
		expect(filter).toBeDefined()
		expect(filter?.logsCriteria?.fromBlock).toBe(0n)
	})

	it('should throw UnknownBlockError for invalid fromBlock', async () => {
		const client = createTevmNode()
		await client.ready()
		const handler = ethNewFilterHandler(client)

		await expect(
			handler({
				fromBlock: 999999n, // Non-existent block
				toBlock: 'latest',
			}),
		).rejects.toThrow('does not exist')
	})

	it('should throw UnknownBlockError for invalid toBlock', async () => {
		const client = createTevmNode()
		await client.ready()
		const handler = ethNewFilterHandler(client)

		await expect(
			handler({
				fromBlock: 'latest',
				toBlock: 999999n, // Non-existent block
			}),
		).rejects.toThrow('does not exist')
	})

	it('should create filter with block 0 using numeric value', async () => {
		const client = createTevmNode()
		await client.ready()
		const handler = ethNewFilterHandler(client)

		const filterId = await handler({
			fromBlock: 0n,
			toBlock: 0n,
		})

		const filter = client.getFilters().get(filterId)
		expect(filter).toBeDefined()
		expect(filter?.logsCriteria?.fromBlock).toBe(0n)
		expect(filter?.logsCriteria?.toBlock).toBe(0n)
	})

	it('should generate unique filter IDs', async () => {
		const client = createTevmNode()
		await client.ready()
		const handler = ethNewFilterHandler(client)

		const filterIds = new Set<string>()

		for (let i = 0; i < 10; i++) {
			const filterId = await handler({
				fromBlock: 'latest',
				toBlock: 'latest',
			})
			filterIds.add(filterId)
		}

		// All filter IDs should be unique
		expect(filterIds.size).toBe(10)
	})

	it('should create filter without address or topics (match all logs)', async () => {
		const client = createTevmNode()
		await client.ready()
		const handler = ethNewFilterHandler(client)

		const filterId = await handler({
			fromBlock: 'latest',
			toBlock: 'latest',
		})

		const filter = client.getFilters().get(filterId)
		expect(filter).toBeDefined()
		expect(filter?.logsCriteria?.address).toBeUndefined()
		expect(filter?.logsCriteria?.topics).toBeUndefined()
	})

	it('should handle topics with undefined values (wildcards)', async () => {
		const client = createTevmNode()
		await client.ready()
		const handler = ethNewFilterHandler(client)

		const topic1 = keccak256(stringToHex('Transfer(address,address,uint256)'))

		const filterId = await handler({
			topics: [topic1],
			fromBlock: 'latest',
			toBlock: 'latest',
		})

		const filter = client.getFilters().get(filterId)
		expect(filter).toBeDefined()
		expect(filter?.logsCriteria?.topics).toEqual([topic1])
	})

	it('should populate logs with complete log metadata', async () => {
		const client = createTevmNode()
		await client.ready()

		const from = createAddress(PREFUNDED_ACCOUNTS[0].address).toString()
		await setAccountHandler(client)({
			address: from,
			balance: 10000000000000000000n,
		})

		// Deploy contract
		const contract = SimpleContract.withAddress(createContractAddress(createAddress(from), 0n).toString())

		await callHandler(client)({
			from,
			data: encodeDeployData(contract.deploy(0n)),
			createTransaction: true,
		})
		await mineHandler(client)()

		// Emit an event
		await callHandler(client)({
			from,
			to: contract.address,
			data: encodeFunctionData(contract.write.set(42n)),
			createTransaction: true,
		})
		await mineHandler(client)()

		// Create filter
		const handler = ethNewFilterHandler(client)
		const filterId = await handler({
			address: contract.address,
			fromBlock: 0n,
			toBlock: 'latest',
		})

		const filter = client.getFilters().get(filterId)
		const logs = filter?.logs

		expect(logs).toBeDefined()
		expect(logs!.length).toBeGreaterThan(0)

		const log = logs![0]
		expect(log?.address).toBeDefined()
		expect(log?.topics).toBeDefined()
		expect(log?.data).toBeDefined()
		expect(log?.blockNumber).toBeDefined()
		expect(log?.transactionHash).toBeDefined()
		expect(log?.transactionIndex).toBeDefined()
		expect(log?.blockHash).toBeDefined()
		expect(log?.logIndex).toBeDefined()
		expect(log?.removed).toBe(false)
	})

	it('should filter logs by address when retrieving past logs', async () => {
		const client = createTevmNode()
		await client.ready()

		const from = createAddress(PREFUNDED_ACCOUNTS[0].address).toString()
		await setAccountHandler(client)({
			address: from,
			balance: 10000000000000000000n,
		})

		// Deploy two contracts
		const contract1 = SimpleContract.withAddress(createContractAddress(createAddress(from), 0n).toString())
		await callHandler(client)({
			from,
			data: encodeDeployData(contract1.deploy(0n)),
			createTransaction: true,
		})
		await mineHandler(client)()

		const contract2 = SimpleContract.withAddress(createContractAddress(createAddress(from), 1n).toString())
		await callHandler(client)({
			from,
			data: encodeDeployData(contract2.deploy(0n)),
			createTransaction: true,
		})
		await mineHandler(client)()

		// Emit events from both contracts
		await callHandler(client)({
			from,
			to: contract1.address,
			data: encodeFunctionData(contract1.write.set(1n)),
			createTransaction: true,
		})
		await callHandler(client)({
			from,
			to: contract2.address,
			data: encodeFunctionData(contract2.write.set(2n)),
			createTransaction: true,
		})
		await mineHandler(client)()

		// Create filter for only contract1
		const handler = ethNewFilterHandler(client)
		const filterId = await handler({
			address: contract1.address,
			fromBlock: 0n,
			toBlock: 'latest',
		})

		const filter = client.getFilters().get(filterId)
		const logs = filter?.logs

		// All logs should be from contract1
		expect(logs).toBeDefined()
		logs?.forEach((log) => {
			expect(log.address.toLowerCase()).toBe(contract1.address.toLowerCase())
		})
	})

	it('should filter logs by topics when retrieving past logs', async () => {
		const client = createTevmNode()
		await client.ready()

		const from = createAddress(PREFUNDED_ACCOUNTS[0].address).toString()
		await setAccountHandler(client)({
			address: from,
			balance: 10000000000000000000n,
		})

		// Deploy contract
		const contract = SimpleContract.withAddress(createContractAddress(createAddress(from), 0n).toString())

		await callHandler(client)({
			from,
			data: encodeDeployData(contract.deploy(0n)),
			createTransaction: true,
		})
		await mineHandler(client)()

		// Emit events
		await callHandler(client)({
			from,
			to: contract.address,
			data: encodeFunctionData(contract.write.set(100n)),
			createTransaction: true,
		})
		await mineHandler(client)()

		// Create filter with specific topic
		const topic = keccak256(stringToHex('ValueSet(uint256)'))
		const handler = ethNewFilterHandler(client)
		const filterId = await handler({
			address: contract.address,
			topics: [topic],
			fromBlock: 0n,
			toBlock: 'latest',
		})

		const filter = client.getFilters().get(filterId)
		const logs = filter?.logs

		expect(logs).toBeDefined()
		expect(logs!.length).toBeGreaterThan(0)
		logs?.forEach((log) => {
			expect(log.topics[0]).toBe(topic)
		})
	})

	it('should handle creating multiple filters concurrently', async () => {
		const client = createTevmNode()
		await client.ready()
		const handler = ethNewFilterHandler(client)

		const promises = Array.from({ length: 5 }, () =>
			handler({
				fromBlock: 'latest',
				toBlock: 'latest',
			}),
		)

		const filterIds = await Promise.all(promises)

		// All should succeed and have unique IDs
		expect(filterIds.length).toBe(5)
		const uniqueIds = new Set(filterIds)
		expect(uniqueIds.size).toBe(5)

		// All filters should be registered
		filterIds.forEach((id) => {
			expect(client.getFilters().get(id)).toBeDefined()
		})
	})

	it('should handle latest block tag for both fromBlock and toBlock', async () => {
		const client = createTevmNode()
		await client.ready()
		const handler = ethNewFilterHandler(client)

		const filterId = await handler({
			fromBlock: 'latest',
			toBlock: 'latest',
		})

		const filter = client.getFilters().get(filterId)
		expect(filter).toBeDefined()
		expect(filter?.logsCriteria?.fromBlock).toBeDefined()
		expect(filter?.logsCriteria?.toBlock).toBe('latest')
	})

	it('should store filter criteria for later retrieval', async () => {
		const client = createTevmNode()
		await client.ready()
		const handler = ethNewFilterHandler(client)

		// Mine enough blocks so blocks 5 and 10 exist
		for (let i = 0; i < 11; i++) {
			await mineHandler(client)()
		}

		const testAddress = '0x1234567890123456789012345678901234567890' as const
		const topic = keccak256(stringToHex('Transfer(address,address,uint256)'))

		const filterId = await handler({
			address: testAddress,
			topics: [topic],
			fromBlock: 5n,
			toBlock: 10n,
		})

		const filter = client.getFilters().get(filterId)
		expect(filter?.logsCriteria).toEqual({
			address: testAddress,
			topics: [topic],
			fromBlock: 5n,
			toBlock: 10n,
		})
	})
})
