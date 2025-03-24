[**@tevm/solc**](../README.md)

***

[@tevm/solc](../globals.md) / SolcStorageLayoutItem

# Type Alias: SolcStorageLayoutItem\<T\>

> **SolcStorageLayoutItem**\<`T`\> = `object`

Defined in: [solcTypes.ts:451](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/solc/src/solcTypes.ts#L451)

An item present in the contract's storage

## See

[Solidity documentation](https://docs.soliditylang.org/en/latest/internals/layout_in_storage.html#json-output)

## Type Parameters

### T

`T` *extends* [`SolcStorageLayoutTypes`](SolcStorageLayoutTypes.md) = [`SolcStorageLayoutTypes`](SolcStorageLayoutTypes.md)

## Properties

### astId

> **astId**: `number`

Defined in: [solcTypes.ts:455](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/solc/src/solcTypes.ts#L455)

The id of the AST node of the state variable's declaration

***

### contract

> **contract**: `string`

Defined in: [solcTypes.ts:459](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/solc/src/solcTypes.ts#L459)

The name of the contract including its path as prefix

***

### label

> **label**: `string`

Defined in: [solcTypes.ts:463](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/solc/src/solcTypes.ts#L463)

The name of the state variable

***

### offset

> **offset**: `number`

Defined in: [solcTypes.ts:467](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/solc/src/solcTypes.ts#L467)

The offset in bytes within the storage slot according to the encoding

***

### slot

> **slot**: `string`

Defined in: [solcTypes.ts:471](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/solc/src/solcTypes.ts#L471)

The storage slot where the state variable resides or starts

***

### type

> **type**: keyof `T`

Defined in: [solcTypes.ts:475](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/solc/src/solcTypes.ts#L475)

The identifier used as a key to the variable's type information in the [SolcStorageLayoutTypes](SolcStorageLayoutTypes.md) record
