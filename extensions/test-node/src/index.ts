// Export the new simplified API
export { createTestSnapshotClient } from './createTestSnapshotClient.js'
export { createTestSnapshotNode } from './createTestSnapshotNode.js'
export { createTestSnapshotTransport } from './createTestSnapshotTransport.js'

// Re-export types for convenience
export type {
	PassthroughConfig,
	TestOptions,
	TestSnapshotClient,
	TestSnapshotClientOptions,
	TestSnapshotNode,
	TestSnapshotNodeOptions,
	TestSnapshotTransport,
	TestSnapshotTransportOptions,
} from './types.js'
