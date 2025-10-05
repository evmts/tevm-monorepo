import { dirname } from 'node:path'
import {
	createTestSnapshotNode,
	createTestSnapshotTransport,
	type TestSnapshotNodeOptions,
	type TestSnapshotTransportOptions,
} from '@tevm/test-node'
import { expect } from 'vitest'
import { transports } from './transports.js'

const getTestDir = (): string => {
	const testPath = expect.getState().testPath
	if (!testPath) {
		throw new Error('Test file path not available. These utilities must be called from within a vitest test context.')
	}
	return dirname(testPath)
}

export const createCachedMainnetNode = (options?: TestSnapshotNodeOptions) =>
	createTestSnapshotNode({
		...options,
		fork: {
			transport: transports.mainnet,
			blockTag: 23518496n,
			...options?.fork,
		},
		test: {
			cacheDir: `${getTestDir()}/__rpc_snapshots__/mainnet`,
			autosave: 'onRequest',
			...options?.test,
		},
	})

export const createCachedOptimismNode = (options?: TestSnapshotNodeOptions) =>
	createTestSnapshotNode({
		...options,
		fork: {
			transport: transports.optimism,
			blockTag: 142076244n,
			...options?.fork,
		},
		test: {
			cacheDir: `${getTestDir()}/__rpc_snapshots__/optimism`,
			autosave: 'onRequest',
			...options?.test,
		},
	})

export const createCachedMainnetTransport = (options?: TestSnapshotTransportOptions) =>
	createTestSnapshotTransport({
		transport: transports.mainnet,
		test: {
			cacheDir: `${getTestDir()}/__rpc_snapshots__/mainnet`,
			autosave: 'onRequest',
			...options?.test,
		},
	})

export const createCachedOptimismTransport = (options?: TestSnapshotTransportOptions) =>
	createTestSnapshotTransport({
		transport: transports.optimism,
		test: {
			cacheDir: `${getTestDir()}/__rpc_snapshots__/optimism`,
			autosave: 'onRequest',
			...options?.test,
		},
	})
