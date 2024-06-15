[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [index](../README.md) / SyncStoragePersister

# Type alias: SyncStoragePersister

> **SyncStoragePersister**: `object`

## Type declaration

### persistTevmState()

> **persistTevmState**: (`state`) => `void`

#### Parameters

• **state**: [`SerializableTevmState`](../../state/type-aliases/SerializableTevmState.md)

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

## Source

packages/sync-storage-persister/types/SyncStoragePersister.d.ts:2
