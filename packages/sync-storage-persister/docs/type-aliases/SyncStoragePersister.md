[**@tevm/sync-storage-persister**](../README.md)

***

[@tevm/sync-storage-persister](../globals.md) / SyncStoragePersister

# Type Alias: SyncStoragePersister

> **SyncStoragePersister** = `object`

Defined in: [SyncStoragePersister.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/packages/sync-storage-persister/src/SyncStoragePersister.ts#L6)

Storage persister for client state

## Properties

### persistTevmState()

> **persistTevmState**: (`state`, `onError`?) => `Error` \| `undefined`

Defined in: [SyncStoragePersister.ts:13](https://github.com/evmts/tevm-monorepo/blob/main/packages/sync-storage-persister/src/SyncStoragePersister.ts#L13)

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

***

### removePersistedState()

> **removePersistedState**: () => `Error` \| `undefined`

Defined in: [SyncStoragePersister.ts:26](https://github.com/evmts/tevm-monorepo/blob/main/packages/sync-storage-persister/src/SyncStoragePersister.ts#L26)

Removes persisted state

#### Returns

`Error` \| `undefined`

Error if one occurs during removal

***

### restoreState()

> **restoreState**: () => `SerializableTevmState` \| `undefined`

Defined in: [SyncStoragePersister.ts:21](https://github.com/evmts/tevm-monorepo/blob/main/packages/sync-storage-persister/src/SyncStoragePersister.ts#L21)

Restores persisted state

#### Returns

`SerializableTevmState` \| `undefined`

The persisted state if it exists
