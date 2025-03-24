[**tevm**](../../../README.md)

***

[tevm](../../../modules.md) / [bundler/solc](../README.md) / SolcStorageLayout

# Type Alias: SolcStorageLayout\<T\>

> **SolcStorageLayout**\<`T`\> = `object`

Defined in: bundler-packages/solc/types/src/solcTypes.d.ts:150

The storage layout for a contract.

## Type Parameters

### T

`T` *extends* [`SolcStorageLayoutTypes`](SolcStorageLayoutTypes.md) = [`SolcStorageLayoutTypes`](SolcStorageLayoutTypes.md)

## Properties

### storage

> **storage**: [`SolcStorageLayoutItem`](SolcStorageLayoutItem.md)\<`T`\>[]

Defined in: bundler-packages/solc/types/src/solcTypes.d.ts:155

The list of stored variables with relevant slot information, type and metadata.

#### See

[SolcStorageLayoutItem](SolcStorageLayoutItem.md)

***

### types

> **types**: `T`

Defined in: bundler-packages/solc/types/src/solcTypes.d.ts:160

A record of all types relevant to the stored variables with additional encoding information.

#### See

[SolcStorageLayoutTypes](SolcStorageLayoutTypes.md)
