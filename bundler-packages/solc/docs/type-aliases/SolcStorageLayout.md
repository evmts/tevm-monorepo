[**@tevm/solc**](../README.md)

***

[@tevm/solc](../globals.md) / SolcStorageLayout

# Type Alias: SolcStorageLayout\<T\>

> **SolcStorageLayout**\<`T`\> = `object`

Defined in: [solcTypes.ts:453](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/solc/src/solcTypes.ts#L453)

The storage layout for a contract.

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` *extends* [`SolcStorageLayoutTypes`](SolcStorageLayoutTypes.md) | [`SolcStorageLayoutTypes`](SolcStorageLayoutTypes.md) |

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="storage"></a> `storage` | [`SolcStorageLayoutItem`](SolcStorageLayoutItem.md)\<`T`\>[] | The list of stored variables with relevant slot information, type and metadata. **See** [SolcStorageLayoutItem](SolcStorageLayoutItem.md) | [solcTypes.ts:458](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/solc/src/solcTypes.ts#L458) |
| <a id="types"></a> `types` | `T` | A record of all types relevant to the stored variables with additional encoding information. **See** [SolcStorageLayoutTypes](SolcStorageLayoutTypes.md) | [solcTypes.ts:463](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/solc/src/solcTypes.ts#L463) |
