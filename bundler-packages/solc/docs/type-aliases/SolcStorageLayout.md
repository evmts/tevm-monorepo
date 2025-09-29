[**@tevm/solc**](../README.md)

***

[@tevm/solc](../globals.md) / SolcStorageLayout

# Type Alias: SolcStorageLayout\<T\>

> **SolcStorageLayout**\<`T`\> = `object`

Defined in: [solcTypes.ts:427](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/solc/src/solcTypes.ts#L427)

The storage layout for a contract.

## Type Parameters

### T

`T` *extends* [`SolcStorageLayoutTypes`](SolcStorageLayoutTypes.md) = [`SolcStorageLayoutTypes`](SolcStorageLayoutTypes.md)

## Properties

### storage

> **storage**: [`SolcStorageLayoutItem`](SolcStorageLayoutItem.md)\<`T`\>[]

Defined in: [solcTypes.ts:432](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/solc/src/solcTypes.ts#L432)

The list of stored variables with relevant slot information, type and metadata.

#### See

[SolcStorageLayoutItem](SolcStorageLayoutItem.md)

***

### types

> **types**: `T`

Defined in: [solcTypes.ts:437](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/solc/src/solcTypes.ts#L437)

A record of all types relevant to the stored variables with additional encoding information.

#### See

[SolcStorageLayoutTypes](SolcStorageLayoutTypes.md)
