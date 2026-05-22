[**@tevm/solc**](../README.md)

***

[@tevm/solc](../globals.md) / SolcStorageLayoutTypeBase

# Interface: SolcStorageLayoutTypeBase

Defined in: [solcTypes.ts:512](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/solc/src/solcTypes.ts#L512)

The base type for all storage layout types.

## Extended by

- [`SolcStorageLayoutBytesType`](SolcStorageLayoutBytesType.md)
- [`SolcStorageLayoutDynamicArrayType`](SolcStorageLayoutDynamicArrayType.md)
- [`SolcStorageLayoutInplaceType`](SolcStorageLayoutInplaceType.md)
- [`SolcStorageLayoutMappingType`](SolcStorageLayoutMappingType.md)

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="encoding"></a> `encoding` | `"inplace"` \| `"mapping"` \| `"dynamic_array"` \| `"bytes"` | How the data is encoded in storage - inplace: data is laid out contiguously in storage - mapping: keccak-256 hash-based method - dynamic_array: keccak-256 hash-based method - bytes: single slot or keccak-256 hash-based depending on the data size | [solcTypes.ts:521](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/solc/src/solcTypes.ts#L521) |
| <a id="label"></a> `label` | `string` | The canonical type name | [solcTypes.ts:525](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/solc/src/solcTypes.ts#L525) |
| <a id="numberofbytes"></a> `numberOfBytes` | `string` | The number of used bytes (as a decimal string) Note: if numberOfBytes > 32 this means that more than one slot is used | [solcTypes.ts:531](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/solc/src/solcTypes.ts#L531) |
