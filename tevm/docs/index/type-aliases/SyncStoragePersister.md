[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / SyncStoragePersister

# Type Alias: SyncStoragePersister

> **SyncStoragePersister** = `object`

Defined in: tevm-monorepo/packages/sync-storage-persister/types/SyncStoragePersister.d.ts:5

Storage persister for client state

## Properties

### persistTevmState

> **persistTevmState**: (`state`, `onError?`) => `Error` \| `undefined`

Defined in: tevm-monorepo/packages/sync-storage-persister/types/SyncStoragePersister.d.ts:12

Persist serializable tevm state

#### Parameters

##### state

[`SerializableTevmState`](../../state/type-aliases/SerializableTevmState.md) \| `undefined`

State to be persisted

##### onError?

(`error`) => `void`

Called when state fails to persist

#### Returns

`Error` \| `undefined`

Error if one occurs during persistence

***

### removePersistedState

> **removePersistedState**: () => `Error` \| `undefined`

Defined in: tevm-monorepo/packages/sync-storage-persister/types/SyncStoragePersister.d.ts:22

Removes persisted state

#### Returns

`Error` \| `undefined`

Error if one occurs during removal

***

### restoreState

> **restoreState**: () => [`SerializableTevmState`](../../state/type-aliases/SerializableTevmState.md) \| `undefined`

Defined in: tevm-monorepo/packages/sync-storage-persister/types/SyncStoragePersister.d.ts:17

Restores persisted state

#### Returns

[`SerializableTevmState`](../../state/type-aliases/SerializableTevmState.md) \| `undefined`

The persisted state if it exists
