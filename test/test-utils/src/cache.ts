import { mainnet, optimism } from '@tevm/common'
import {
	createTestSnapshotNode,
	createTestSnapshotTransport,
	type TestSnapshotNodeOptions,
	type TestSnapshotTransportOptions,
} from '@tevm/test-node'
import type { EIP1193RequestFn } from 'viem'
import { transports } from './transports.js'

type CachedSnapshotTransportOptions = Omit<TestSnapshotTransportOptions, 'transport'> & {
	snapshotOnly?: boolean
}

const EMPTY_32 = `0x${'0'.repeat(64)}`
const EMPTY_BLOOM = `0x${'0'.repeat(512)}`
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

const snapshotMissRequest = (async (args) => {
	const method = args.method
	const paramsArray = Array.isArray(args.params) ? args.params : []

	switch (method) {
		case 'eth_chainId':
			return '0x1'
		case 'eth_blockNumber':
			return '0x0'
		case 'eth_call':
			return '0x'
		case 'eth_getCode':
			return '0x'
		case 'eth_getLogs':
			return []
		case 'eth_getProof':
			return {
				address: paramsArray[0] ?? ZERO_ADDRESS,
				accountProof: [],
				balance: '0x0',
				codeHash: EMPTY_32,
				nonce: '0x0',
				storageHash: EMPTY_32,
				storageProof: [],
			}
		case 'eth_getBlockByNumber':
		case 'eth_getBlockByHash':
			return {
				number: typeof paramsArray[0] === 'string' ? paramsArray[0] : '0x0',
				hash: EMPTY_32,
				parentHash: EMPTY_32,
				nonce: '0x0000000000000000',
				sha3Uncles: EMPTY_32,
				logsBloom: EMPTY_BLOOM,
				transactionsRoot: EMPTY_32,
				stateRoot: EMPTY_32,
				receiptsRoot: EMPTY_32,
				miner: ZERO_ADDRESS,
				difficulty: '0x0',
				totalDifficulty: '0x0',
				extraData: '0x',
				size: '0x0',
				gasLimit: '0x0',
				gasUsed: '0x0',
				timestamp: '0x0',
				uncles: [],
				baseFeePerGas: '0x0',
				blobGasUsed: '0x0',
				excessBlobGas: '0x0',
				parentBeaconBlockRoot: EMPTY_32,
				withdrawalsRoot: EMPTY_32,
				withdrawals: [],
				transactions: [],
			}
		default:
			return null
	}
}) as EIP1193RequestFn

const snapshotMissTransport: { request: EIP1193RequestFn } = {
	request: snapshotMissRequest,
}

export const createCachedMainnetNode = (options?: TestSnapshotNodeOptions) =>
	createTestSnapshotNode({
		...options,
		fork: {
			transport: transports.mainnet,
			blockTag: 23531308n,
			...options?.fork,
		},
		common: mainnet,
		test: options?.test,
	})

export const createCachedOptimismNode = (options?: TestSnapshotNodeOptions) =>
	createTestSnapshotNode({
		...options,
		fork: {
			transport: transports.optimism,
			blockTag: 142153711n,
			...options?.fork,
		},
		common: optimism,
		test: options?.test,
	})

export const createCachedMainnetTransport = (options?: CachedSnapshotTransportOptions) =>
	createTestSnapshotTransport({
		transport: options?.snapshotOnly ? snapshotMissTransport : transports.mainnet,
		test: options?.test,
	})

export const createCachedOptimismTransport = (options?: CachedSnapshotTransportOptions) =>
	createTestSnapshotTransport({
		transport: options?.snapshotOnly ? snapshotMissTransport : transports.optimism,
		test: options?.test,
	})
