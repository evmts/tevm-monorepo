// Export the new simplified API
export { createTestSnapshotClient } from './createTestSnapshotClient.js'
export { createTestSnapshotNode } from './createTestSnapshotNode.js'

// Re-export types for convenience
export type {
	TestSnapshotClient,
	TestSnapshotClientOptions,
	TestSnapshotNode,
	TestSnapshotNodeOptions,
	TestOptions,
} from './types.js'
