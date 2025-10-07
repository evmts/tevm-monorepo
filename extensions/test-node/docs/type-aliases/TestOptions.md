[**@tevm/test-node**](../README.md)

***

[@tevm/test-node](../globals.md) / TestOptions

# Type Alias: TestOptions

> **TestOptions** = `object`

Defined in: [extensions/test-node/src/types.ts:9](https://github.com/evmts/tevm-monorepo/blob/main/extensions/test-node/src/types.ts#L9)

## Properties

### autosave?

> `optional` **autosave**: `SnapshotAutosaveMode`

Defined in: [extensions/test-node/src/types.ts:48](https://github.com/evmts/tevm-monorepo/blob/main/extensions/test-node/src/types.ts#L48)

Controls when snapshots are automatically saved to disk.

- 'onRequest' (default): Save snapshots after each request is cached
- 'onStop': Save snapshots only when stopping the server
- 'onSave': Save only when manually calling saveSnapshots()

Using 'onRequest' provides real-time snapshot persistence, ensuring data is written
immediately. Use 'onStop' for better performance when you only need snapshots
persisted at the end of your test run. Use 'onSave' for complete manual control
over when snapshots are written to disk.

#### Default

```ts
'onRequest'
```

***

### resolveSnapshotPath?

> `optional` **resolveSnapshotPath**: `"vitest"` \| () => `string`

Defined in: [extensions/test-node/src/types.ts:33](https://github.com/evmts/tevm-monorepo/blob/main/extensions/test-node/src/types.ts#L33)

Controls how snapshot file paths are resolved.

- 'vitest' (default): Automatically resolve using vitest's test context,
  snapshots saved in __rpc_snapshots__ subdirectory next to test file
- Function: Custom resolver that returns the full absolute path to the snapshot file.
  Use this when not running in vitest context or need custom snapshot locations.

#### Default

```ts
'vitest'
```

#### Example

```typescript
// Snapshots in __rpc_snapshots__/ subdirectory (default behavior, requires vitest)
test: { resolveSnapshotPath: 'vitest' }

// Or simply omit it (same as above)
test: {}

// Custom path - returns full path including filename
test: {
  resolveSnapshotPath: () => '/custom/path/to/my-snapshots.json'
}
```
