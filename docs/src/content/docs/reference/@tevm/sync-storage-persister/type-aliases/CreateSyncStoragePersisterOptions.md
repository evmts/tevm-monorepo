---
editUrl: false
next: false
prev: false
title: "CreateSyncStoragePersisterOptions"
---

> **CreateSyncStoragePersisterOptions**: `object`

Options for creating a sync storage persister.

## Type declaration

### deserialize()?

> **`optional`** **deserialize**: (`cachedString`) => [`SerializableTevmState`](/reference/state/type-aliases/serializabletevmstate/)

How to deserialize the data from storage.

#### Default

`JSON.parse`

#### Parameters

• **cachedString**: `string`

#### Returns

[`SerializableTevmState`](/reference/state/type-aliases/serializabletevmstate/)

### key?

> **`optional`** **key**: `string`

The key to use when storing the cache

### serialize()?

> **`optional`** **serialize**: (`client`) => `string`

How to serialize the data to storage.

#### Default

`JSON.stringify`

#### Parameters

• **client**: [`SerializableTevmState`](/reference/state/type-aliases/serializabletevmstate/)

#### Returns

`string`

### storage

> **storage**: [`Storage`](/reference/interfaces/storage/)

The storage client used for setting and retrieving items from cache.
For SSR pass in `undefined`. Note that window.localStorage can be
`null` in Android WebViews depending on how they are configured.

### throttleTime?

> **`optional`** **throttleTime**: `number`

To avoid spamming, pass a time in ms to throttle saving the cache to disk

## Source

[CreateSyncStoragePersisterOptions.ts:7](https://github.com/evmts/tevm-monorepo/blob/main/packages/sync-storage-persister/src/CreateSyncStoragePersisterOptions.ts#L7)
