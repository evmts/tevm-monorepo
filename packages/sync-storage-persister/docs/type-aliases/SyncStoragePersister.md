[**@tevm/sync-storage-persister**](../README.md)

***

[@tevm/sync-storage-persister](../globals.md) / SyncStoragePersister

# Type Alias: SyncStoragePersister

> **SyncStoragePersister**: `object`

Defined in: [SyncStoragePersister.ts:3](https://github.com/evmts/tevm-monorepo/blob/main/packages/sync-storage-persister/src/SyncStoragePersister.ts#L3)

## Type declaration

### persistTevmState()

> **persistTevmState**: (`state`) => `void`

#### Parameters

##### state

`SerializableTevmState`

#### Returns

`void`

### removePersistedState()

> **removePersistedState**: () => `void`

#### Returns

`void`

### restoreState()

> **restoreState**: () => `SerializableTevmState` \| `undefined`

#### Returns

`SerializableTevmState` \| `undefined`
