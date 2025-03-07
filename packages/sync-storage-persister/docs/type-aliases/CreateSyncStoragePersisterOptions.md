[**@tevm/sync-storage-persister**](../README.md)

***

[@tevm/sync-storage-persister](../globals.md) / CreateSyncStoragePersisterOptions

# Type Alias: CreateSyncStoragePersisterOptions

> **CreateSyncStoragePersisterOptions**: `object`

Defined in: [CreateSyncStoragePersisterOptions.ts:7](https://github.com/evmts/tevm-monorepo/blob/main/packages/sync-storage-persister/src/CreateSyncStoragePersisterOptions.ts#L7)

Options for creating a sync storage persister.

## Type declaration

### deserialize()?

> `optional` **deserialize**: (`cachedString`) => `SerializableTevmState`

How to deserialize the data from storage.

#### Parameters

##### cachedString

`string`

#### Returns

`SerializableTevmState`

#### Default

`JSON.parse`

### key?

> `optional` **key**: `string`

The key to use when storing the cache

### serialize()?

> `optional` **serialize**: (`client`) => `string`

How to serialize the data to storage.

#### Parameters

##### client

`SerializableTevmState`

#### Returns

`string`

#### Default

`JSON.stringify`

### storage

> **storage**: [`Storage`](../interfaces/Storage.md)

The storage client used for setting and retrieving items from cache.
For SSR pass in `undefined`. Note that window.localStorage can be
`null` in Android WebViews depending on how they are configured.

### throttleTime?

> `optional` **throttleTime**: `number`

To avoid spamming, pass a time in ms to throttle saving the cache to disk
