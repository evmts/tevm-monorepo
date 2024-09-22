import { createAddress } from '@tevm/address'
import { createTevmNode } from '@tevm/node'
import { SimpleContract } from '@tevm/test-utils'
import {
	type Address,
	type Hex,
	PREFUNDED_ACCOUNTS,
	encodeDeployData,
	encodeFunctionData,
	hexToBytes,
	keccak256,
	stringToHex,
} from '@tevm/utils'
import { describe, expect, it } from 'vitest'
import { callHandler } from '../Call/callHandler.js'
import { deployHandler } from '../Deploy/deployHandler.js'
import { mineHandler } from '../Mine/mineHandler.js'
import { setAccountHandler } from '../SetAccount/setAccountHandler.js'
import type { FilterParams } from '../common/FilterParams.js'
import { ethGetLogsHandler } from './ethGetLogsHandler.js'

describe(ethGetLogsHandler.name, () => {
	const getValueSetTopic = () => {
		const eventAbi = SimpleContract.events.ValueSet.abi[0]
		const signature = `${eventAbi.name}(${eventAbi.inputs.map((input) => input.type).join(',')})`
		return keccak256(stringToHex(signature))
	}

	const setupAccount = async (client: ReturnType<typeof createTevmNode>, address: Address) => {
		await setAccountHandler(client)({
			address,
			balance: 10000000000000000000n, // 10 ETH
		})
	}

	it.todo('should return logs for a given block range', async () => {
		const client = createTevmNode()
		const from = createAddress(PREFUNDED_ACCOUNTS[0].address)

		await setupAccount(client, from.toString())

		// Deploy SimpleContract
		const deploy = deployHandler(client)
		const deployResult = await deploy({
			abi: SimpleContract.abi,
			bytecode: SimpleContract.bytecode,
			args: [0n],
			from: from.toString(),
		})

		const contractAddress = deployResult.createdAddress as Address

		// Emit some events
		for (let i = 0; i < 3; i++) {
			await callHandler(client)({
				to: contractAddress,
				from: from.toString(),
				data: encodeFunctionData(SimpleContract.write.set(BigInt(i))),
				createTransaction: true,
			})
		}

		await mineHandler(client)()

		const filterParams: FilterParams = {
			address: contractAddress,
			fromBlock: 0n,
			toBlock: 'latest',
			topics: [getValueSetTopic()],
		}

		const logs = await ethGetLogsHandler(client)({
			filterParams,
		})

		expect(logs).toHaveLength(3)
		expect(logs[0]).toMatchObject({
			address: contractAddress,
			blockNumber: expect.any(BigInt),
			transactionHash: expect.any(String),
		})
	})

	it.todo('should filter logs by topics', async () => {
		const client = createTevmNode()
		const from = createAddress(PREFUNDED_ACCOUNTS[0].address)

		await setupAccount(client, from.toString())

		// Deploy SimpleContract
		const deployResult = await callHandler(client)({
			createTransaction: true,
			from: from.toString(),
			data: encodeDeployData(SimpleContract.deploy(0n)),
		})

		const contractAddress = deployResult.createdAddress as Address

		// Set values to emit events
		await callHandler(client)({
			to: contractAddress,
			from: from.toString(),
			data: encodeFunctionData(SimpleContract.write.set(1n)),
			createTransaction: true,
		})

		await callHandler(client)({
			to: contractAddress,
			from: from.toString(),
			data: encodeFunctionData(SimpleContract.write.set(2n)),
			createTransaction: true,
		})

		await mineHandler(client)()

		const filterParams: FilterParams = {
			address: contractAddress,
			fromBlock: 0n,
			toBlock: 'latest',
			topics: [getValueSetTopic()],
		}

		const logs = await ethGetLogsHandler(client)({
			filterParams,
		})

		expect(logs).toHaveLength(2)
		expect(logs[0]).toBeTruthy()
		expect(logs[1]).toBeTruthy()
	})

	it.todo('should handle pending blocks', async () => {
		const client = createTevmNode()
		const from = createAddress(PREFUNDED_ACCOUNTS[0].address)

		await setupAccount(client, from.toString())

		// Deploy SimpleContract
		const deployResult = await callHandler(client)({
			createTransaction: true,
			from: from.toString(),
			data: encodeDeployData(SimpleContract.deploy(0n)),
		})

		const contractAddress = deployResult.createdAddress as Address

		// Emit an event without mining
		await callHandler(client)({
			to: contractAddress,
			from: from.toString(),
			data: encodeFunctionData(SimpleContract.write.set(42n)),
			createTransaction: true,
		})

		const filterParams: FilterParams = {
			address: contractAddress,
			fromBlock: 0n,
			toBlock: 'pending',
			topics: [getValueSetTopic()],
		}

		const logs = await ethGetLogsHandler(client)({
			filterParams,
		})

		expect(logs).toHaveLength(1)
		expect(logs[0]?.blockNumber).toBe('pending')
	})

	it.todo('should return all logs when no topics are specified', async () => {
		const client = createTevmNode()
		const from = createAddress('0x1234567890123456789012345678901234567890')

		await setupAccount(client, from.toString())

		// Deploy SimpleContract
		const deploy = deployHandler(client)
		const deployResult = await deploy({
			abi: SimpleContract.abi,
			bytecode: SimpleContract.bytecode,
			args: [0n],
			from: from.toString(),
		})

		const contractAddress = deployResult.createdAddress as Address

		// Emit some events
		for (let i = 0; i < 3; i++) {
			await callHandler(client)({
				to: contractAddress,
				from: from.toString(),
				data: encodeFunctionData(SimpleContract.write.set(BigInt(i))),
				createTransaction: true,
			})
		}

		const res = await mineHandler(client)()

		const block = await client.getVm().then((vm) => vm.blockchain.getBlock(hexToBytes(res.blockHashes?.[0] as Hex)))

		const receiptManager = await client.getReceiptsManager()
		block.transactions.forEach(async (tx) => {
			const [receipt] = (await receiptManager.getReceiptByTxHash(tx.hash())) ?? []
			console.log(receipt?.logs)
		})

		const logs = await ethGetLogsHandler(client)({
			filterParams: {},
		})

		expect(logs).toHaveLength(3)
		expect(logs[0]).toMatchObject({
			address: contractAddress,
			blockNumber: expect.any(BigInt),
			transactionHash: expect.any(String),
		})

		logs.forEach((log) => {
			expect(log.data).toBeTruthy()
		})
	})

	it.todo('should work fetching logs that were created by tevm after forking')
})
