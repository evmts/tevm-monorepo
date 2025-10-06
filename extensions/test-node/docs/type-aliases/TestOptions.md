[**@tevm/test-node**](../README.md)

***

[@tevm/test-node](../globals.md) / TestOptions

# Type Alias: TestOptions

> **TestOptions** = `object`

Defined in: [extensions/test-node/src/types.ts:9](https://github.com/evmts/tevm-monorepo/blob/main/extensions/test-node/src/types.ts#L9)

## Properties

### autosave?

> `optional` **autosave**: `SnapshotAutosaveMode`

Defined in: [extensions/test-node/src/types.ts:27](https://github.com/evmts/tevm-monorepo/blob/main/extensions/test-node/src/types.ts#L27)

Controls when snapshots are automatically saved to disk.

- 'onStop' (default): Save snapshots only when stopping the server
- 'onRequest': Save snapshots after each request is cached

Using 'onRequest' provides real-time snapshot persistence but may impact performance
with frequent I/O operations. Use 'onStop' for better performance when you only
need snapshots persisted at the end of your test run (or whenever you call `stop()` or `save()`).

#### Default

```ts
'onStop'
```

***

### cacheDir?

> `optional` **cacheDir**: `string`

Defined in: [extensions/test-node/src/types.ts:14](https://github.com/evmts/tevm-monorepo/blob/main/extensions/test-node/src/types.ts#L14)

The directory to store snapshot files.

#### Default

```ts
'.tevm/test-snapshots/<test-file-name>'
```
