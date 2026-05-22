[**@tevm/sync-storage-persister**](../README.md)

***

[@tevm/sync-storage-persister](../globals.md) / CreateSyncStoragePersisterOptions

# Type Alias: CreateSyncStoragePersisterOptions

> **CreateSyncStoragePersisterOptions** = `object`

Defined in: [CreateSyncStoragePersisterOptions.ts:7](https://github.com/evmts/tevm-monorepo/blob/main/packages/sync-storage-persister/src/CreateSyncStoragePersisterOptions.ts#L7)

Options for creating a sync storage persister.

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="deserialize"></a> `deserialize?` | (`cachedString`) => `SerializableTevmState` | How to deserialize the data from storage. **Default** `JSON.parse` | [CreateSyncStoragePersisterOptions.ts:26](https://github.com/evmts/tevm-monorepo/blob/main/packages/sync-storage-persister/src/CreateSyncStoragePersisterOptions.ts#L26) |
| <a id="key"></a> `key?` | `string` | The key to use when storing the cache | [CreateSyncStoragePersisterOptions.ts:14](https://github.com/evmts/tevm-monorepo/blob/main/packages/sync-storage-persister/src/CreateSyncStoragePersisterOptions.ts#L14) |
| <a id="serialize"></a> `serialize?` | (`client`) => `string` | How to serialize the data to storage. **Default** `JSON.stringify` | [CreateSyncStoragePersisterOptions.ts:21](https://github.com/evmts/tevm-monorepo/blob/main/packages/sync-storage-persister/src/CreateSyncStoragePersisterOptions.ts#L21) |
| <a id="storage"></a> `storage` | [`Storage`](../interfaces/Storage.md) | The storage client used for setting and retrieving items from cache. For SSR pass in `undefined`. Note that window.localStorage can be `null` in Android WebViews depending on how they are configured. | [CreateSyncStoragePersisterOptions.ts:12](https://github.com/evmts/tevm-monorepo/blob/main/packages/sync-storage-persister/src/CreateSyncStoragePersisterOptions.ts#L12) |
| <a id="throttletime"></a> `throttleTime?` | `number` | To avoid spamming, pass a time in ms to throttle saving the cache to disk | [CreateSyncStoragePersisterOptions.ts:16](https://github.com/evmts/tevm-monorepo/blob/main/packages/sync-storage-persister/src/CreateSyncStoragePersisterOptions.ts#L16) |
