import { mainnet, optimism } from '@tevm/common'
import { createTestSnapshotTransport, type TestSnapshotTransportOptions } from '@tevm/test-node'
import { transports } from '@tevm/test-utils'

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

export const cachedForks = {
	mainnet,
	optimism,
}
