[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [index](../README.md) / CreateSyncStoragePersisterOptions

# Type alias: CreateSyncStoragePersisterOptions

> **CreateSyncStoragePersisterOptions**: `object`

Options for creating a sync storage persister.

## Type declaration

### deserialize()?

> `optional` **deserialize**: (`cachedString`) => [`SerializableTevmState`](../../state/type-aliases/SerializableTevmState.md)

How to deserialize the data from storage.

#### Default

`JSON.parse`

#### Parameters

• **cachedString**: `string`

#### Returns

[`SerializableTevmState`](../../state/type-aliases/SerializableTevmState.md)

### key?

> `optional` **key**: `string`

The key to use when storing the cache

### serialize()?

> `optional` **serialize**: (`client`) => `string`

How to serialize the data to storage.

#### Default

`JSON.stringify`

#### Parameters

• **client**: [`SerializableTevmState`](../../state/type-aliases/SerializableTevmState.md)

#### Returns

`string`

### storage

> **storage**: [`Storage`](../interfaces/Storage.md)

The storage client used for setting and retrieving items from cache.
For SSR pass in `undefined`. Note that window.localStorage can be
`null` in Android WebViews depending on how they are configured.

### throttleTime?

> `optional` **throttleTime**: `number`

To avoid spamming, pass a time in ms to throttle saving the cache to disk

## Source

packages/sync-storage-persister/types/CreateSyncStoragePersisterOptions.d.ts:6
