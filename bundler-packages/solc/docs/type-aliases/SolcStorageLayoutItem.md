[**@tevm/solc**](../README.md)

***

[@tevm/solc](../globals.md) / SolcStorageLayoutItem

# Type Alias: SolcStorageLayoutItem\<T\>

> **SolcStorageLayoutItem**\<`T`\> = `object`

Defined in: [solcTypes.ts:470](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/solc/src/solcTypes.ts#L470)

An item present in the contract's storage

## See

[Solidity documentation](https://docs.soliditylang.org/en/latest/internals/layout_in_storage.html#json-output)

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` *extends* [`SolcStorageLayoutTypes`](SolcStorageLayoutTypes.md) | [`SolcStorageLayoutTypes`](SolcStorageLayoutTypes.md) |

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="astid"></a> `astId` | `number` | The id of the AST node of the state variable's declaration | [solcTypes.ts:474](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/solc/src/solcTypes.ts#L474) |
| <a id="contract"></a> `contract` | `string` | The name of the contract including its path as prefix | [solcTypes.ts:478](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/solc/src/solcTypes.ts#L478) |
| <a id="label"></a> `label` | `string` | The name of the state variable | [solcTypes.ts:482](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/solc/src/solcTypes.ts#L482) |
| <a id="offset"></a> `offset` | `number` | The offset in bytes within the storage slot according to the encoding | [solcTypes.ts:486](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/solc/src/solcTypes.ts#L486) |
| <a id="slot"></a> `slot` | `string` | The storage slot where the state variable resides or starts | [solcTypes.ts:490](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/solc/src/solcTypes.ts#L490) |
| <a id="type"></a> `type` | keyof `T` | The identifier used as a key to the variable's type information in the [SolcStorageLayoutTypes](SolcStorageLayoutTypes.md) record | [solcTypes.ts:494](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/solc/src/solcTypes.ts#L494) |
