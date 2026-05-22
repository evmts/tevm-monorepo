[**@tevm/solc**](../README.md)

***

[@tevm/solc](../globals.md) / SolcStorageLayoutDynamicArrayType

# Interface: SolcStorageLayoutDynamicArrayType

Defined in: [solcTypes.ts:566](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/solc/src/solcTypes.ts#L566)

A storage layout type that is laid out in a keccak-256 hash-based method.

## Extends

- [`SolcStorageLayoutTypeBase`](SolcStorageLayoutTypeBase.md)

## Properties

| Property | Type | Description | Overrides | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ | ------ |
| <a id="base"></a> `base` | `` `t_${string}` `` | The base type of the dynamic array | - | - | [solcTypes.ts:571](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/solc/src/solcTypes.ts#L571) |
| <a id="encoding"></a> `encoding` | `"dynamic_array"` | How the data is encoded in storage - inplace: data is laid out contiguously in storage - mapping: keccak-256 hash-based method - dynamic_array: keccak-256 hash-based method - bytes: single slot or keccak-256 hash-based depending on the data size | [`SolcStorageLayoutTypeBase`](SolcStorageLayoutTypeBase.md).[`encoding`](SolcStorageLayoutTypeBase.md#encoding) | - | [solcTypes.ts:567](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/solc/src/solcTypes.ts#L567) |
| <a id="label"></a> `label` | `string` | The canonical type name | - | [`SolcStorageLayoutTypeBase`](SolcStorageLayoutTypeBase.md).[`label`](SolcStorageLayoutTypeBase.md#label) | [solcTypes.ts:525](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/solc/src/solcTypes.ts#L525) |
| <a id="numberofbytes"></a> `numberOfBytes` | `string` | The number of used bytes (as a decimal string) Note: if numberOfBytes > 32 this means that more than one slot is used | - | [`SolcStorageLayoutTypeBase`](SolcStorageLayoutTypeBase.md).[`numberOfBytes`](SolcStorageLayoutTypeBase.md#numberofbytes) | [solcTypes.ts:531](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/solc/src/solcTypes.ts#L531) |
