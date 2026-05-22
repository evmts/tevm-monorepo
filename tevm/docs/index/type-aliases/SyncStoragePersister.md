[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / SyncStoragePersister

# Type Alias: SyncStoragePersister

> **SyncStoragePersister** = `object`

Storage persister for client state

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| <a id="persisttevmstate"></a> `persistTevmState` | (`state`, `onError?`) => `Error` \| `undefined` | Persist serializable tevm state |
| <a id="removepersistedstate"></a> `removePersistedState` | () => `Error` \| `undefined` | Removes persisted state |
| <a id="restorestate"></a> `restoreState` | () => [`SerializableTevmState`](../../state/type-aliases/SerializableTevmState.md) \| `undefined` | Restores persisted state |
