---
editUrl: false
next: false
prev: false
title: "CreateSyncStoragePersisterOptions"
---

> **CreateSyncStoragePersisterOptions**: `object`

Options for creating a sync storage persister.

## Type declaration

### deserialize

> **deserialize**?: (`cachedString`) => [`SerializableTevmState`](/reference/tevm/state/type-aliases/serializabletevmstate/)

How to deserialize the data from storage.

#### Default

`JSON.parse`

How to deserialize the data from storage.

#### Parameters

▪ **cachedString**: `string`

#### Returns

#### Default

`JSON.parse`

### key

> **key**?: `string`

The key to use when storing the cache

### serialize

> **serialize**?: (`client`) => `string`

How to serialize the data to storage.

#### Default

`JSON.stringify`

How to serialize the data to storage.

#### Parameters

▪ **client**: [`SerializableTevmState`](/reference/tevm/state/type-aliases/serializabletevmstate/)

#### Returns

#### Default

`JSON.stringify`

### storage

> **storage**: [`Storage`](/reference/tevm/sync-storage-persister/interfaces/storage/)

The storage client used for setting and retrieving items from cache.
For SSR pass in `undefined`. Note that window.localStorage can be
`null` in Android WebViews depending on how they are configured.

### throttleTime

> **throttleTime**?: `number`

To avoid spamming, pass a time in ms to throttle saving the cache to disk

## Source

[CreateSyncStoragePersisterOptions.ts:7](https://github.com/evmts/tevm-monorepo/blob/main/packages/sync-storage-persister/src/CreateSyncStoragePersisterOptions.ts#L7)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
