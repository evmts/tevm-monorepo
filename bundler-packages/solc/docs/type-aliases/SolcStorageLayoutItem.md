[**@tevm/solc**](../README.md)

***

[@tevm/solc](../globals.md) / SolcStorageLayoutItem

# Type Alias: SolcStorageLayoutItem\<T\>

> **SolcStorageLayoutItem**\<`T`\>: `object`

Defined in: [solcTypes.ts:451](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/solc/src/solcTypes.ts#L451)

An item present in the contract's storage

## Type Parameters

• **T** *extends* [`SolcStorageLayoutTypes`](SolcStorageLayoutTypes.md) = [`SolcStorageLayoutTypes`](SolcStorageLayoutTypes.md)

## Type declaration

### astId

> **astId**: `number`

The id of the AST node of the state variable's declaration

### contract

> **contract**: `string`

The name of the contract including its path as prefix

### label

> **label**: `string`

The name of the state variable

### offset

> **offset**: `number`

The offset in bytes within the storage slot according to the encoding

### slot

> **slot**: `string`

The storage slot where the state variable resides or starts

### type

> **type**: keyof `T`

The identifier used as a key to the variable's type information in the [SolcStorageLayoutTypes](SolcStorageLayoutTypes.md) record

## See

[Solidity documentation](https://docs.soliditylang.org/en/latest/internals/layout_in_storage.html#json-output)
