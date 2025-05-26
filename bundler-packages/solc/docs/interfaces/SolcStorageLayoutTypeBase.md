[**@tevm/solc**](../README.md)

***

[@tevm/solc](../globals.md) / SolcStorageLayoutTypeBase

# Interface: SolcStorageLayoutTypeBase

Defined in: [solcTypes.ts:488](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/solc/src/solcTypes.ts#L488)

The base type for all storage layout types.

## Extended by

- [`SolcStorageLayoutInplaceType`](SolcStorageLayoutInplaceType.md)
- [`SolcStorageLayoutBytesType`](SolcStorageLayoutBytesType.md)
- [`SolcStorageLayoutMappingType`](SolcStorageLayoutMappingType.md)
- [`SolcStorageLayoutDynamicArrayType`](SolcStorageLayoutDynamicArrayType.md)

## Properties

### encoding

> **encoding**: `"inplace"` \| `"mapping"` \| `"dynamic_array"` \| `"bytes"`

Defined in: [solcTypes.ts:497](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/solc/src/solcTypes.ts#L497)

How the data is encoded in storage

- inplace: data is laid out contiguously in storage
- mapping: keccak-256 hash-based method
- dynamic_array: keccak-256 hash-based method
- bytes: single slot or keccak-256 hash-based depending on the data size

***

### label

> **label**: `string`

Defined in: [solcTypes.ts:501](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/solc/src/solcTypes.ts#L501)

The canonical type name

***

### numberOfBytes

> **numberOfBytes**: `string`

Defined in: [solcTypes.ts:507](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/solc/src/solcTypes.ts#L507)

The number of used bytes (as a decimal string)

Note: if numberOfBytes > 32 this means that more than one slot is used
