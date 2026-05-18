import { SimpleContract } from '@tevm/contract'
import { type AbiEvent, encodeAbiParameters, encodeEventTopics, type Hex, hexToBytes } from '@tevm/utils'
import { describe, expect, it } from 'vitest'
import { logToEthjsLog } from './logToEthjsLog.js'

describe('logToEthjsLog', () => {
	const abi = SimpleContract.abi

	it('should correctly convert log arguments to ethjs log format', () => {
		const log = {
			eventName: 'ValueSet',
			args: {
				newValue: 100n,
			},
			address: '0x0000000000000000000000000000000000000002',
		} as const
		const result = logToEthjsLog(abi, log)

		const topics = encodeEventTopics({
			abi,
			eventName: log.eventName,
			args: log.args,
		}).map((topic) => hexToBytes(topic as `0x${string}`))
		const eventItem = abi.find((item) => item.type === 'event' && item.name === log.eventName)
		const data = encodeAbiParameters(eventItem?.inputs as any, Object.values(log.args))

		expect(result).toEqual([hexToBytes(log.address), topics, hexToBytes(data)])
	})

	it('should throw an error if event is not found in ABI', () => {
		const log = {
			eventName: 'NonExistentEvent',
			args: {},
			address: '0x0000000000000000000000000000000000000002',
		} as const

		expect(() => logToEthjsLog(abi, log as any)).toThrowErrorMatchingInlineSnapshot(
			`
			[AbiEventNotFoundError: Event "NonExistentEvent" not found on ABI.
			Make sure you are using the correct ABI and that the event exists on it.

			Docs: https://viem.sh/docs/contract/encodeEventTopics
			Version: viem@2.37.9]
		`,
		)
	})

	it('should handle empty args', () => {
		const log = {
			eventName: 'ValueSet',
			args: {},
			address: '0x0000000000000000000000000000000000000002',
		} as const
		const abi = [
			{
				name: 'ValueSet',
				type: 'event',
				inputs: [],
			},
		] as [AbiEvent]
		const result = logToEthjsLog(abi, log)

		const topics = encodeEventTopics({
			abi: abi,
			eventName: log.eventName,
			args: log.args,
		}).map((topic) => hexToBytes(topic as `0x${string}`))
		const eventItem = abi.find((item) => item.type === 'event' && item.name === log.eventName)
		if (!eventItem) throw new Error('Event not found in ABI')
		const data = encodeAbiParameters(eventItem.inputs, [] as any)

		expect(result).toEqual([hexToBytes(log.address), topics, hexToBytes(data)])
	})

	it('should handle indexed and non-indexed parameters correctly', () => {
		const abiWithIndexed = [
			{
				name: 'IndexedEvent',
				type: 'event',
				inputs: [
					{ name: 'indexedParam', type: 'uint256', indexed: true },
					{ name: 'nonIndexedParam', type: 'string', indexed: false },
				],
			},
		] as [AbiEvent]

		const log = {
			eventName: 'IndexedEvent',
			args: {
				indexedParam: 123n,
				nonIndexedParam: 'test',
			},
			address: '0x0000000000000000000000000000000000000003',
		} as const

		const result = logToEthjsLog(abiWithIndexed, log)

		const topics = encodeEventTopics({
			abi: abiWithIndexed,
			eventName: log.eventName,
			args: log.args,
		}).map((topic) => hexToBytes(topic as `0x${string}`))

		const eventItem = abiWithIndexed[0]
		const data = encodeAbiParameters(
			eventItem.inputs.filter((input) => !input.indexed),
			[log.args.nonIndexedParam],
		)

		expect(result).toEqual([hexToBytes(log.address), topics, hexToBytes(data)])
		expect(result[1].length).toBe(2) // Event signature + 1 indexed parameter
		expect(result[2].length).toBeGreaterThan(0) // Non-empty data for non-indexed parameter
	})

	it('should handle events with only indexed parameters', () => {
		const abiWithOnlyIndexed = [
			{
				name: 'AllIndexedEvent',
				type: 'event',
				inputs: [
					{ name: 'param1', type: 'uint256', indexed: true },
					{ name: 'param2', type: 'address', indexed: true },
				],
			},
		] as [AbiEvent]

		const log = {
			eventName: 'AllIndexedEvent',
			args: {
				param1: 42n,
				param2: '0x1234567890123456789012345678901234567890',
			},
			address: '0x0000000000000000000000000000000000000004',
		} as const

		const result = logToEthjsLog(abiWithOnlyIndexed, log)

		expect(result[1].length).toBe(3) // Event signature + 2 indexed parameters
		expect(result[2].length).toBe(0) // Empty data for all indexed parameters
	})

	it('should handle events with array parameters', () => {
		const abiWithArray = [
			{
				name: 'ArrayEvent',
				type: 'event',
				inputs: [
					{ name: 'numbers', type: 'uint256[]', indexed: false },
					{ name: 'flag', type: 'bool', indexed: true },
				],
			},
		] as [AbiEvent]

		const log = {
			eventName: 'ArrayEvent',
			args: {
				numbers: [1n, 2n, 3n],
				flag: true,
			},
			address: '0x0000000000000000000000000000000000000005',
		} as const

		const result = logToEthjsLog(abiWithArray, log)

		expect(result[1].length).toBe(2) // Event signature + 1 indexed parameter
		expect(result[2].length).toBeGreaterThan(0) // Non-empty data for array parameter
	})

	it('should handle events with bytes and string parameters', () => {
		const abiWithBytesAndString = [
			{
				name: 'BytesAndStringEvent',
				type: 'event',
				inputs: [
					{ name: 'data', type: 'bytes', indexed: false },
					{ name: 'text', type: 'string', indexed: true },
				],
			},
		] as [AbiEvent]

		const log = {
			eventName: 'BytesAndStringEvent',
			args: {
				data: '0x1234567890',
				text: 'Hello, world!',
			},
			address: '0x0000000000000000000000000000000000000006',
		} as const

		const result = logToEthjsLog(abiWithBytesAndString, log)

		expect(result[1].length).toBe(2) // Event signature + 1 indexed parameter (keccak256 hash of the string)
		expect(result[2].length).toBeGreaterThan(0) // Non-empty data for bytes parameter
	})

	it('should correctly handle a Uniswap Ethereum log', () => {
		// https://etherscan.io/tx/0x1c359b587a843deff89a4fa3d8d674ea3edefafd2801d262ab771a9baaaad6ad#eventlog#66
		const exampleLog = {
			address: '0x9081b50bad8beefac48cc616694c26b027c559bb',
			topics: [
				'0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822',
				'0x0000000000000000000000001111111254eeb25477b68fb85ed929f73a960582',
				'0x000000000000000000000000b4e16d0168e52d35cacd2c6185b44281ec28c9dc',
			],
			data: '0x000000000000000000000000000000000000000000000008a19685b3e7332498000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000551deaf9c04d1be',
			blockHash: '0x9ab81662fa8a40baa50e09515f9c45c89e5c6cb5af3b11e6e37d13a1e6489036',
			blockNumber: '0x13fd31c',
			transactionHash: '0x1c359b587a843deff89a4fa3d8d674ea3edefafd2801d262ab771a9baaaad6ad',
			transactionIndex: '0xc',
			logIndex: '0x42',
			removed: false,
		}

		const log = {
			eventName: 'Swap',
			args: {
				sender: '0x1111111254eeb25477b68fb85ed929f73a960582',
				to: '0xb4e16d0168e52d35cacd2c6185b44281ec28c9dc',
				amount0In: 159217593484013937816n,
				amount1In: 0n,
				amount0Out: 0n,
				amount1Out: 383332289121407422n,
			},
			address: '0x9081b50bad8beefac48cc616694c26b027c559bb',
		} as const

		const uniswapV2PairAbi = [
			{
				anonymous: false,
				inputs: [
					{ indexed: true, name: 'sender', type: 'address' },
					{ indexed: false, name: 'amount0In', type: 'uint256' },
					{ indexed: false, name: 'amount1In', type: 'uint256' },
					{ indexed: false, name: 'amount0Out', type: 'uint256' },
					{ indexed: false, name: 'amount1Out', type: 'uint256' },
					{ indexed: true, name: 'to', type: 'address' },
				],
				name: 'Swap',
				type: 'event',
			},
		] as const

		const [address, topics, data] = logToEthjsLog(uniswapV2PairAbi, log)

		expect(address).toEqual(hexToBytes(exampleLog.address as Hex))
		expect(topics).toEqual(exampleLog.topics.map((topic) => hexToBytes(topic as Hex)))
		expect(data).toEqual(hexToBytes(exampleLog.data as Hex))
	})
})
