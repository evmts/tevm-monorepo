[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / SyncStoragePersister

# Type Alias: SyncStoragePersister

> **SyncStoragePersister**: `object`

Defined in: packages/sync-storage-persister/types/SyncStoragePersister.d.ts:2

## Type declaration

### persistTevmState()

> **persistTevmState**: (`state`) => `void`

#### Parameters

##### state

[`SerializableTevmState`](../../state/type-aliases/SerializableTevmState.md)

#### Returns

`void`

### removePersistedState()

> **removePersistedState**: () => `void`

#### Returns

`void`

### restoreState()

> **restoreState**: () => [`SerializableTevmState`](../../state/type-aliases/SerializableTevmState.md) \| `undefined`

#### Returns

[`SerializableTevmState`](../../state/type-aliases/SerializableTevmState.md) \| `undefined`
