[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / SyncStoragePersister

# Type Alias: SyncStoragePersister

> **SyncStoragePersister**: `object`

Defined in: packages/sync-storage-persister/types/SyncStoragePersister.d.ts:5

Storage persister for client state

## Type declaration

### persistTevmState()

> **persistTevmState**: (`state`, `onError`?) => `Error` \| `undefined`

Persist serializable tevm state

#### Parameters

##### state

State to be persisted

[`SerializableTevmState`](../../state/type-aliases/SerializableTevmState.md) | `undefined`

##### onError?

(`error`) => `void`

Called when state fails to persist

#### Returns

`Error` \| `undefined`

Error if one occurs during persistence

### removePersistedState()

> **removePersistedState**: () => `Error` \| `undefined`

Removes persisted state

#### Returns

`Error` \| `undefined`

Error if one occurs during removal

### restoreState()

> **restoreState**: () => [`SerializableTevmState`](../../state/type-aliases/SerializableTevmState.md) \| `undefined`

Restores persisted state

#### Returns

[`SerializableTevmState`](../../state/type-aliases/SerializableTevmState.md) \| `undefined`

The persisted state if it exists
