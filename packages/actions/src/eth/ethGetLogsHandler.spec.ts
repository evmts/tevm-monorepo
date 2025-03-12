import { createAddress } from '@tevm/address'
import { createTevmNode } from '@tevm/node'
import { SimpleContract, transports } from '@tevm/test-utils'
import {
	type Address,
	PREFUNDED_ACCOUNTS,
	encodeDeployData,
	encodeFunctionData,
	hexToNumber,
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

	it('should return logs for a given block range', async () => {
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
		expect(deployResult.createdAddresses?.size).toBe(1)
		await mineHandler(client)()

		// Emit some events
		for (let i = 0; i < 3; i++) {
			const res = await callHandler(client)({
				to: contractAddress,
				from: from.toString(),
				data: encodeFunctionData(SimpleContract.write.set(BigInt(i))),
				createTransaction: true,
			})
			expect(res.logs).toHaveLength(1)
			await mineHandler(client)()
			const { rawData: newValue } = await callHandler(client)({
				to: contractAddress,
				data: encodeFunctionData(SimpleContract.read.get()),
			})
			expect(hexToNumber(newValue)).toBe(i)
		}

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
			// this is actually a bug
			address: createAddress(contractAddress).toString().toLowerCase(),
			blockNumber: expect.any(BigInt),
			transactionHash: expect.any(String),
		})
	})

	it('should filter logs by topics', async () => {
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

		// Mine the deployment transaction
		await mineHandler(client)()

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

	it('should handle pending blocks', async () => {
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

		// Mine the deployment transaction
		await mineHandler(client)()

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
		expect(logs[0]?.blockNumber).toBe(2n)
	})

	it('should return all logs when no topics are specified', async () => {
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

		// Mine the deployment transaction
		await mineHandler(client)()

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

		const logs = await ethGetLogsHandler(client)({
			filterParams: {},
		})

		expect(logs).toHaveLength(3)
		expect(logs[0]).toMatchObject({
			address: contractAddress.toLowerCase(),
			blockNumber: expect.any(BigInt),
			transactionHash: expect.any(String),
		})

		logs.forEach((log) => {
			expect(log.data).toBeTruthy()
		})
	})

	it('should work for past blocks in forked mode', { timeout: 20_000 }, async () => {
		const client = createTevmNode({
			fork: {
				transport: transports.optimism,
				blockTag: 125985200n,
			},
		})
		const logs = await ethGetLogsHandler(client)({
			filterParams: {
				address: '0xdC6fF44d5d932Cbd77B52E5612Ba0529DC6226F1',
				fromBlock: 125985142n,
				toBlock: 125985142n,
				topics: [
					'0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925',
					'0x0000000000000000000000007f26A7572E8B877654eeDcBc4E573657619FA3CE',
					'0x0000000000000000000000007B46fFbC976db2F94C3B3CDD9EbBe4ab50E3d77d',
				],
			},
		})
		expect(logs).toHaveLength(1)
		expect(logs).toMatchInlineSnapshot(`
				[
				  {
				    "address": "0xdc6ff44d5d932cbd77b52e5612ba0529dc6226f1",
				    "blockHash": "0x6c9355482a6937e44fbfbd1c0c9cc95882e47e80c9b48772699c6a49bad1e392",
				    "blockNumber": 125985142n,
				    "data": "0x0000000000000000000000000000000000000000000b2f1069a1f95dc7180000",
				    "logIndex": 23n,
				    "removed": false,
				    "topics": [
				      "0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925",
				      "0x0000000000000000000000007f26a7572e8b877654eedcbc4e573657619fa3ce",
				      "0x0000000000000000000000007b46ffbc976db2f94c3b3cdd9ebbe4ab50e3d77d",
				    ],
				    "transactionHash": "0x4f0781ec417fecaf44b248fd0b0485dca9fbe78ad836598b65c12bb13ab9ddd4",
				    "transactionIndex": 11n,
				  },
				]
			`)
	})

	it("should filter logs with OR'ed topics", async () => {
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

		// Mine the deployment transaction
		await mineHandler(client)()

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

		const topic1 = keccak256(stringToHex('ValueSet(uint256)'))
		const topic2 = keccak256(stringToHex('NonExistentEvent(uint256)'))

		const filterParams: FilterParams = {
			address: contractAddress,
			fromBlock: 0n,
			toBlock: 'latest',
			topics: [[topic1, topic2]],
		}

		const logs = await ethGetLogsHandler(client)({
			filterParams,
		})

		expect(logs).toHaveLength(2)
		expect(logs[0]).toBeTruthy()
		expect(logs[1]).toBeTruthy()
		logs.forEach((log) => {
			expect(log.topics[0]).toBe(topic1)
		})
	})
})
