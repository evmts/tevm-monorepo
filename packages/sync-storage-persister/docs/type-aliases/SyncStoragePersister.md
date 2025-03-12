[**@tevm/sync-storage-persister**](../README.md)

***

[@tevm/sync-storage-persister](../globals.md) / SyncStoragePersister

# Type Alias: SyncStoragePersister

> **SyncStoragePersister**: `object`

Defined in: [SyncStoragePersister.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/packages/sync-storage-persister/src/SyncStoragePersister.ts#L6)

Storage persister for client state

## Type declaration

### persistTevmState()

> **persistTevmState**: (`state`, `onError`?) => `Error` \| `undefined`

Persist serializable tevm state

#### Parameters

##### state

State to be persisted

`SerializableTevmState` | `undefined`

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

> **restoreState**: () => `SerializableTevmState` \| `undefined`

Restores persisted state

#### Returns

`SerializableTevmState` \| `undefined`

The persisted state if it exists
