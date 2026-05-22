[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / CreateSyncStoragePersisterOptions

# Type Alias: CreateSyncStoragePersisterOptions

> **CreateSyncStoragePersisterOptions** = `object`

Options for creating a sync storage persister.

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| <a id="deserialize"></a> `deserialize?` | (`cachedString`) => [`SerializableTevmState`](../../state/type-aliases/SerializableTevmState.md) | How to deserialize the data from storage. **Default** `JSON.parse` |
| <a id="key"></a> `key?` | `string` | The key to use when storing the cache |
| <a id="serialize"></a> `serialize?` | (`client`) => `string` | How to serialize the data to storage. **Default** `JSON.stringify` |
| <a id="storage"></a> `storage` | [`Storage`](../interfaces/Storage.md) | The storage client used for setting and retrieving items from cache. For SSR pass in `undefined`. Note that window.localStorage can be `null` in Android WebViews depending on how they are configured. |
| <a id="throttletime"></a> `throttleTime?` | `number` | To avoid spamming, pass a time in ms to throttle saving the cache to disk |
