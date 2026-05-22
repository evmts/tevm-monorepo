[**tevm**](../../../README.md)

***

[tevm](../../../modules.md) / [bundler/solc](../README.md) / SolcStorageLayout

# Type Alias: SolcStorageLayout\<T\>

> **SolcStorageLayout**\<`T`\> = `object`

The storage layout for a contract.

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` *extends* [`SolcStorageLayoutTypes`](SolcStorageLayoutTypes.md) | [`SolcStorageLayoutTypes`](SolcStorageLayoutTypes.md) |

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| <a id="storage"></a> `storage` | [`SolcStorageLayoutItem`](SolcStorageLayoutItem.md)\<`T`\>[] | The list of stored variables with relevant slot information, type and metadata. **See** [SolcStorageLayoutItem](SolcStorageLayoutItem.md) |
| <a id="types"></a> `types` | `T` | A record of all types relevant to the stored variables with additional encoding information. **See** [SolcStorageLayoutTypes](SolcStorageLayoutTypes.md) |
