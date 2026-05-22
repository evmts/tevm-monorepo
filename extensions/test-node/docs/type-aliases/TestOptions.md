[**@tevm/test-node**](../README.md)

***

[@tevm/test-node](../globals.md) / TestOptions

# Type Alias: TestOptions

> **TestOptions** = `object`

Defined in: [extensions/test-node/src/types.ts:11](https://github.com/evmts/tevm-monorepo/blob/main/extensions/test-node/src/types.ts#L11)

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="autosave"></a> `autosave?` | `SnapshotAutosaveMode` | Controls when snapshots are automatically saved to disk. - 'onRequest' (default): Save snapshots after each request is cached - 'onStop': Save snapshots only when stopping the server - 'onSave': Save only when manually calling saveSnapshots() Using 'onRequest' provides real-time snapshot persistence, ensuring data is written immediately. Use 'onStop' for better performance when you only need snapshots persisted at the end of your test run. Use 'onSave' for complete manual control over when snapshots are written to disk. **Default** `'onRequest'` | [extensions/test-node/src/types.ts:50](https://github.com/evmts/tevm-monorepo/blob/main/extensions/test-node/src/types.ts#L50) |
| <a id="resolvesnapshotpath"></a> `resolveSnapshotPath?` | `"vitest"` \| `"bun"` \| (() => `string`) | Controls how snapshot file paths are resolved. - 'vitest' (default): Automatically resolve using test runner's context (vitest or Bun), snapshots saved in __rpc_snapshots__ subdirectory next to test file - Function: Custom resolver that returns the full absolute path to the snapshot file. Use this when not running in a supported test context or need custom snapshot locations. **Default** `'vitest'` **Example** `// Snapshots in __rpc_snapshots__/ subdirectory (default, auto-detects vitest or Bun) test: { resolveSnapshotPath: 'vitest' } // Or simply omit it (same as above) test: {} // Custom path - returns full path including filename test: { resolveSnapshotPath: () => '/custom/path/to/my-snapshots.json' }` | [extensions/test-node/src/types.ts:35](https://github.com/evmts/tevm-monorepo/blob/main/extensions/test-node/src/types.ts#L35) |
