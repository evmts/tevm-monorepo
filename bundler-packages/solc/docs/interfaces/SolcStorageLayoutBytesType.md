[**@tevm/solc**](../README.md)

***

[@tevm/solc](../globals.md) / SolcStorageLayoutBytesType

# Interface: SolcStorageLayoutBytesType

Defined in: [solcTypes.ts:525](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/solc/src/solcTypes.ts#L525)

A storage layout type that is laid out in a single slot or keccak-256 hash-based depending on the data size.

## Extends

- [`SolcStorageLayoutTypeBase`](SolcStorageLayoutTypeBase.md)

## Properties

### encoding

> **encoding**: `"bytes"`

Defined in: [solcTypes.ts:526](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/solc/src/solcTypes.ts#L526)

How the data is encoded in storage

- inplace: data is laid out contiguously in storage
- mapping: keccak-256 hash-based method
- dynamic_array: keccak-256 hash-based method
- bytes: single slot or keccak-256 hash-based depending on the data size

#### Overrides

[`SolcStorageLayoutTypeBase`](SolcStorageLayoutTypeBase.md).[`encoding`](SolcStorageLayoutTypeBase.md#encoding)

***

### label

> **label**: `string`

Defined in: [solcTypes.ts:506](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/solc/src/solcTypes.ts#L506)

The canonical type name

#### Inherited from

[`SolcStorageLayoutTypeBase`](SolcStorageLayoutTypeBase.md).[`label`](SolcStorageLayoutTypeBase.md#label)

***

### numberOfBytes

> **numberOfBytes**: `string`

Defined in: [solcTypes.ts:512](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/solc/src/solcTypes.ts#L512)

The number of used bytes (as a decimal string)

Note: if numberOfBytes > 32 this means that more than one slot is used

#### Inherited from

[`SolcStorageLayoutTypeBase`](SolcStorageLayoutTypeBase.md).[`numberOfBytes`](SolcStorageLayoutTypeBase.md#numberofbytes)
