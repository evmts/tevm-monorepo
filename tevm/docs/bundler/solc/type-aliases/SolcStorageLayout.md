[**tevm**](../../../README.md)

***

[tevm](../../../modules.md) / [bundler/solc](../README.md) / SolcStorageLayout

# Type Alias: SolcStorageLayout\<T\>

> **SolcStorageLayout**\<`T`\>: `object`

Defined in: bundler-packages/solc/types/src/solcTypes.d.ts:146

The storage layout for a contract.

## Type Parameters

• **T** *extends* [`SolcStorageLayoutTypes`](SolcStorageLayoutTypes.md) = [`SolcStorageLayoutTypes`](SolcStorageLayoutTypes.md)

## Type declaration

### storage

> **storage**: [`SolcStorageLayoutItem`](SolcStorageLayoutItem.md)\<`T`\>[]

The list of stored variables with relevant slot information, type and metadata.

#### See

[SolcStorageLayoutItem](SolcStorageLayoutItem.md)

### types

> **types**: `T`

A record of all types relevant to the stored variables with additional encoding information.

#### See

[SolcStorageLayoutTypes](SolcStorageLayoutTypes.md)
