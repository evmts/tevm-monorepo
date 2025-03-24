[**tevm**](../../../README.md)

***

[tevm](../../../modules.md) / [bundler/solc](../README.md) / SolcStorageLayoutItem

# Type Alias: SolcStorageLayoutItem\<T\>

> **SolcStorageLayoutItem**\<`T`\> = `object`

Defined in: bundler-packages/solc/types/src/solcTypes.d.ts:166

An item present in the contract's storage

## See

[Solidity documentation](https://docs.soliditylang.org/en/latest/internals/layout_in_storage.html#json-output)

## Type Parameters

### T

`T` *extends* [`SolcStorageLayoutTypes`](SolcStorageLayoutTypes.md) = [`SolcStorageLayoutTypes`](SolcStorageLayoutTypes.md)

## Properties

### astId

> **astId**: `number`

Defined in: bundler-packages/solc/types/src/solcTypes.d.ts:170

The id of the AST node of the state variable's declaration

***

### contract

> **contract**: `string`

Defined in: bundler-packages/solc/types/src/solcTypes.d.ts:174

The name of the contract including its path as prefix

***

### label

> **label**: `string`

Defined in: bundler-packages/solc/types/src/solcTypes.d.ts:178

The name of the state variable

***

### offset

> **offset**: `number`

Defined in: bundler-packages/solc/types/src/solcTypes.d.ts:182

The offset in bytes within the storage slot according to the encoding

***

### slot

> **slot**: `string`

Defined in: bundler-packages/solc/types/src/solcTypes.d.ts:186

The storage slot where the state variable resides or starts

***

### type

> **type**: keyof `T`

Defined in: bundler-packages/solc/types/src/solcTypes.d.ts:190

The identifier used as a key to the variable's type information in the [SolcStorageLayoutTypes](SolcStorageLayoutTypes.md) record
