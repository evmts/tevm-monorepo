[**tevm**](../../../README.md)

***

[tevm](../../../modules.md) / [bundler/solc](../README.md) / SolcStorageLayoutStructType

# Interface: SolcStorageLayoutStructType

Defined in: bundler-packages/solc/types/src/solcTypes.d.ts:259

A storage layout type that is a struct.

## Extends

- [`SolcStorageLayoutInplaceType`](SolcStorageLayoutInplaceType.md)

## Properties

### encoding

> **encoding**: `"inplace"`

Defined in: bundler-packages/solc/types/src/solcTypes.d.ts:224

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

Defined in: bundler-packages/solc/types/src/solcTypes.d.ts:212

The canonical type name

#### Inherited from

[`SolcStorageLayoutInplaceType`](SolcStorageLayoutInplaceType.md).[`label`](SolcStorageLayoutInplaceType.md#label)

***

### members

> **members**: [`SolcStorageLayoutItem`](../type-aliases/SolcStorageLayoutItem.md)\<[`SolcStorageLayoutTypes`](../type-aliases/SolcStorageLayoutTypes.md)\>[]

Defined in: bundler-packages/solc/types/src/solcTypes.d.ts:263

The members of the struct in the same format as a [SolcStorageLayoutItem](../type-aliases/SolcStorageLayoutItem.md)

***

### numberOfBytes

> **numberOfBytes**: `string`

Defined in: bundler-packages/solc/types/src/solcTypes.d.ts:218

The number of used bytes (as a decimal string)

Note: if numberOfBytes > 32 this means that more than one slot is used

#### Inherited from

[`SolcStorageLayoutInplaceType`](SolcStorageLayoutInplaceType.md).[`numberOfBytes`](SolcStorageLayoutInplaceType.md#numberofbytes)
