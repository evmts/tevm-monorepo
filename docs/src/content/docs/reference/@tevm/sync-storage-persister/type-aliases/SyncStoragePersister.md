---
editUrl: false
next: false
prev: false
title: "SyncStoragePersister"
---

> **SyncStoragePersister**: `object`

## Type declaration

### persistTevmState()

> **persistTevmState**: (`state`) => `void`

#### Parameters

• **state**: [`SerializableTevmState`](/reference/state/type-aliases/serializabletevmstate/)

#### Returns

`void`

### removePersistedState()

> **removePersistedState**: () => `void`

#### Returns

`void`

### restoreState()

> **restoreState**: () => [`SerializableTevmState`](/reference/state/type-aliases/serializabletevmstate/) \| `undefined`

#### Returns

[`SerializableTevmState`](/reference/state/type-aliases/serializabletevmstate/) \| `undefined`

## Source

[SyncStoragePersister.ts:3](https://github.com/evmts/tevm-monorepo/blob/main/packages/sync-storage-persister/src/SyncStoragePersister.ts#L3)
