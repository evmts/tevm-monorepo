[**@tevm/sync-storage-persister**](../README.md)

***

[@tevm/sync-storage-persister](../globals.md) / SyncStoragePersister

# Type Alias: SyncStoragePersister

> **SyncStoragePersister** = `object`

Defined in: [SyncStoragePersister.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/packages/sync-storage-persister/src/SyncStoragePersister.ts#L6)

Storage persister for client state

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="persisttevmstate"></a> `persistTevmState` | (`state`, `onError?`) => `Error` \| `undefined` | Persist serializable tevm state | [SyncStoragePersister.ts:13](https://github.com/evmts/tevm-monorepo/blob/main/packages/sync-storage-persister/src/SyncStoragePersister.ts#L13) |
| <a id="removepersistedstate"></a> `removePersistedState` | () => `Error` \| `undefined` | Removes persisted state | [SyncStoragePersister.ts:26](https://github.com/evmts/tevm-monorepo/blob/main/packages/sync-storage-persister/src/SyncStoragePersister.ts#L26) |
| <a id="restorestate"></a> `restoreState` | () => `SerializableTevmState` \| `undefined` | Restores persisted state | [SyncStoragePersister.ts:21](https://github.com/evmts/tevm-monorepo/blob/main/packages/sync-storage-persister/src/SyncStoragePersister.ts#L21) |
