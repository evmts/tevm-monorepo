[**tevm**](../../../README.md)

***

[tevm](../../../modules.md) / [bundler/solc](../README.md) / SolcStorageLayoutTypeBase

# Interface: SolcStorageLayoutTypeBase

Defined in: bundler-packages/solc/types/src/solcTypes.d.ts:195

The base type for all storage layout types.

## Extended by

- [`SolcStorageLayoutBytesType`](SolcStorageLayoutBytesType.md)
- [`SolcStorageLayoutDynamicArrayType`](SolcStorageLayoutDynamicArrayType.md)
- [`SolcStorageLayoutInplaceType`](SolcStorageLayoutInplaceType.md)
- [`SolcStorageLayoutMappingType`](SolcStorageLayoutMappingType.md)

## Properties

### encoding

> **encoding**: `"bytes"` \| `"dynamic_array"` \| `"inplace"` \| `"mapping"`

Defined in: bundler-packages/solc/types/src/solcTypes.d.ts:204

How the data is encoded in storage

- inplace: data is laid out contiguously in storage
- mapping: keccak-256 hash-based method
- dynamic_array: keccak-256 hash-based method
- bytes: single slot or keccak-256 hash-based depending on the data size

***

### label

> **label**: `string`

Defined in: bundler-packages/solc/types/src/solcTypes.d.ts:208

The canonical type name

***

### numberOfBytes

> **numberOfBytes**: `string`

Defined in: bundler-packages/solc/types/src/solcTypes.d.ts:214

The number of used bytes (as a decimal string)

Note: if numberOfBytes > 32 this means that more than one slot is used
