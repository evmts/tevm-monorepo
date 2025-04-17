[**@tevm/solc**](../README.md)

***

[@tevm/solc](../globals.md) / SolcStorageLayoutDynamicArrayType

# Interface: SolcStorageLayoutDynamicArrayType

Defined in: [solcTypes.ts:542](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/solc/src/solcTypes.ts#L542)

A storage layout type that is laid out in a keccak-256 hash-based method.

## Extends

- [`SolcStorageLayoutTypeBase`](SolcStorageLayoutTypeBase.md)

## Properties

### base

> **base**: `` `t_${string}` ``

Defined in: [solcTypes.ts:547](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/solc/src/solcTypes.ts#L547)

The base type of the dynamic array

***

### encoding

> **encoding**: `"dynamic_array"`

Defined in: [solcTypes.ts:543](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/solc/src/solcTypes.ts#L543)

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

Defined in: [solcTypes.ts:501](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/solc/src/solcTypes.ts#L501)

The canonical type name

#### Inherited from

[`SolcStorageLayoutTypeBase`](SolcStorageLayoutTypeBase.md).[`label`](SolcStorageLayoutTypeBase.md#label)

***

### numberOfBytes

> **numberOfBytes**: `string`

Defined in: [solcTypes.ts:507](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/solc/src/solcTypes.ts#L507)

The number of used bytes (as a decimal string)

Note: if numberOfBytes > 32 this means that more than one slot is used

#### Inherited from

[`SolcStorageLayoutTypeBase`](SolcStorageLayoutTypeBase.md).[`numberOfBytes`](SolcStorageLayoutTypeBase.md#numberofbytes)
