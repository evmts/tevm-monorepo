[**tevm**](../../../README.md)

***

[tevm](../../../modules.md) / [bundler/solc](../README.md) / SolcStorageLayoutItem

# Type Alias: SolcStorageLayoutItem\<T\>

> **SolcStorageLayoutItem**\<`T`\> = `object`

An item present in the contract's storage

## See

[Solidity documentation](https://docs.soliditylang.org/en/latest/internals/layout_in_storage.html#json-output)

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` *extends* [`SolcStorageLayoutTypes`](SolcStorageLayoutTypes.md) | [`SolcStorageLayoutTypes`](SolcStorageLayoutTypes.md) |

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| <a id="astid"></a> `astId` | `number` | The id of the AST node of the state variable's declaration |
| <a id="contract"></a> `contract` | `string` | The name of the contract including its path as prefix |
| <a id="label"></a> `label` | `string` | The name of the state variable |
| <a id="offset"></a> `offset` | `number` | The offset in bytes within the storage slot according to the encoding |
| <a id="slot"></a> `slot` | `string` | The storage slot where the state variable resides or starts |
| <a id="type"></a> `type` | keyof `T` | The identifier used as a key to the variable's type information in the [SolcStorageLayoutTypes](SolcStorageLayoutTypes.md) record |
