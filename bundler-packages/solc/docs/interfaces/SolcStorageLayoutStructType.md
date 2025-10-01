[**@tevm/solc**](../README.md)

***

[@tevm/solc](../globals.md) / SolcStorageLayoutStructType

# Interface: SolcStorageLayoutStructType

Defined in: [solcTypes.ts:551](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/solc/src/solcTypes.ts#L551)

A storage layout type that is a struct.

## Extends

- [`SolcStorageLayoutInplaceType`](SolcStorageLayoutInplaceType.md)

## Properties

### encoding

> **encoding**: `"inplace"`

Defined in: [solcTypes.ts:512](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/solc/src/solcTypes.ts#L512)

How the data is encoded in storage

- inplace: data is laid out contiguously in storage
- mapping: keccak-256 hash-based method
- dynamic_array: keccak-256 hash-based method
- bytes: single slot or keccak-256 hash-based depending on the data size

#### Inherited from

[`SolcStorageLayoutInplaceType`](SolcStorageLayoutInplaceType.md).[`encoding`](SolcStorageLayoutInplaceType.md#encoding)

***

### label

> **label**: `string`

Defined in: [solcTypes.ts:499](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/solc/src/solcTypes.ts#L499)

The canonical type name

#### Inherited from

[`SolcStorageLayoutInplaceType`](SolcStorageLayoutInplaceType.md).[`label`](SolcStorageLayoutInplaceType.md#label)

***

### members

> **members**: [`SolcStorageLayoutItem`](../type-aliases/SolcStorageLayoutItem.md)\<[`SolcStorageLayoutTypes`](../type-aliases/SolcStorageLayoutTypes.md)\>[]

Defined in: [solcTypes.ts:555](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/solc/src/solcTypes.ts#L555)

The members of the struct in the same format as a [SolcStorageLayoutItem](../type-aliases/SolcStorageLayoutItem.md)

***

### numberOfBytes

> **numberOfBytes**: `string`

Defined in: [solcTypes.ts:505](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/solc/src/solcTypes.ts#L505)

The number of used bytes (as a decimal string)

Note: if numberOfBytes > 32 this means that more than one slot is used

#### Inherited from

[`SolcStorageLayoutInplaceType`](SolcStorageLayoutInplaceType.md).[`numberOfBytes`](SolcStorageLayoutInplaceType.md#numberofbytes)
