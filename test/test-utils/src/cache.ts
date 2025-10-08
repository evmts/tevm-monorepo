import { mainnet, optimism } from '@tevm/common'
import {
	createTestSnapshotNode,
	createTestSnapshotTransport,
	type TestSnapshotNodeOptions,
	type TestSnapshotTransportOptions,
} from '@tevm/test-node'
import { transports } from './transports.js'

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

export const createCachedMainnetTransport = (options?: TestSnapshotTransportOptions) =>
	createTestSnapshotTransport({
		transport: transports.mainnet,
		test: options?.test,
	})

export const createCachedOptimismTransport = (options?: TestSnapshotTransportOptions) =>
	createTestSnapshotTransport({
		transport: transports.optimism,
		test: options?.test,
	})
