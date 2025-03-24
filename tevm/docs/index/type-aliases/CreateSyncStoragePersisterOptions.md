[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / CreateSyncStoragePersisterOptions

# Type Alias: CreateSyncStoragePersisterOptions

> **CreateSyncStoragePersisterOptions** = `object`

Defined in: packages/sync-storage-persister/types/CreateSyncStoragePersisterOptions.d.ts:6

Options for creating a sync storage persister.

## Properties

### deserialize()?

> `optional` **deserialize**: (`cachedString`) => [`SerializableTevmState`](../../state/type-aliases/SerializableTevmState.md)

Defined in: packages/sync-storage-persister/types/CreateSyncStoragePersisterOptions.d.ts:25

How to deserialize the data from storage.

#### Parameters

##### cachedString

`string`

#### Returns

[`SerializableTevmState`](../../state/type-aliases/SerializableTevmState.md)

#### Default

`JSON.parse`

***

### key?

> `optional` **key**: `string`

Defined in: packages/sync-storage-persister/types/CreateSyncStoragePersisterOptions.d.ts:13

The key to use when storing the cache

***

### serialize()?

> `optional` **serialize**: (`client`) => `string`

Defined in: packages/sync-storage-persister/types/CreateSyncStoragePersisterOptions.d.ts:20

How to serialize the data to storage.

#### Parameters

##### client

[`SerializableTevmState`](../../state/type-aliases/SerializableTevmState.md)

#### Returns

`string`

#### Default

`JSON.stringify`

***

### storage

> **storage**: [`Storage`](../interfaces/Storage.md)

Defined in: packages/sync-storage-persister/types/CreateSyncStoragePersisterOptions.d.ts:11

The storage client used for setting and retrieving items from cache.
For SSR pass in `undefined`. Note that window.localStorage can be
`null` in Android WebViews depending on how they are configured.

***

### throttleTime?

> `optional` **throttleTime**: `number`

Defined in: packages/sync-storage-persister/types/CreateSyncStoragePersisterOptions.d.ts:15

To avoid spamming, pass a time in ms to throttle saving the cache to disk
