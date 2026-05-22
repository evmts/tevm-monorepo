[**@tevm/solc**](../README.md)

***

[@tevm/solc](../globals.md) / SolcStorageLayoutStructType

# Interface: SolcStorageLayoutStructType

Defined in: [solcTypes.ts:577](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/solc/src/solcTypes.ts#L577)

A storage layout type that is a struct.

## Extends

- [`SolcStorageLayoutInplaceType`](SolcStorageLayoutInplaceType.md)

## Properties

| Property | Type | Description | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="encoding"></a> `encoding` | `"inplace"` | How the data is encoded in storage - inplace: data is laid out contiguously in storage - mapping: keccak-256 hash-based method - dynamic_array: keccak-256 hash-based method - bytes: single slot or keccak-256 hash-based depending on the data size | [`SolcStorageLayoutInplaceType`](SolcStorageLayoutInplaceType.md).[`encoding`](SolcStorageLayoutInplaceType.md#encoding) | [solcTypes.ts:538](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/solc/src/solcTypes.ts#L538) |
| <a id="label"></a> `label` | `string` | The canonical type name | [`SolcStorageLayoutInplaceType`](SolcStorageLayoutInplaceType.md).[`label`](SolcStorageLayoutInplaceType.md#label) | [solcTypes.ts:525](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/solc/src/solcTypes.ts#L525) |
| <a id="members"></a> `members` | [`SolcStorageLayoutItem`](../type-aliases/SolcStorageLayoutItem.md)\<[`SolcStorageLayoutTypes`](../type-aliases/SolcStorageLayoutTypes.md)\>[] | The members of the struct in the same format as a [SolcStorageLayoutItem](../type-aliases/SolcStorageLayoutItem.md) | - | [solcTypes.ts:581](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/solc/src/solcTypes.ts#L581) |
| <a id="numberofbytes"></a> `numberOfBytes` | `string` | The number of used bytes (as a decimal string) Note: if numberOfBytes > 32 this means that more than one slot is used | [`SolcStorageLayoutInplaceType`](SolcStorageLayoutInplaceType.md).[`numberOfBytes`](SolcStorageLayoutInplaceType.md#numberofbytes) | [solcTypes.ts:531](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/solc/src/solcTypes.ts#L531) |
