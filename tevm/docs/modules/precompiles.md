[tevm](../README.md) / [Modules](../modules.md) / precompiles

# Module: precompiles

## Table of contents

### References

- [ConstructorArgument](precompiles.md#constructorargument)
- [defineCall](precompiles.md#definecall)
- [definePrecompile](precompiles.md#defineprecompile)

### Type Aliases

- [CustomPrecompile](precompiles.md#customprecompile)

## References

### ConstructorArgument

Re-exports [ConstructorArgument](index.md#constructorargument)

___

### defineCall

Re-exports [defineCall](index.md#definecall)

___

### definePrecompile

Re-exports [definePrecompile](index.md#defineprecompile)

## Type Aliases

### CustomPrecompile

Ƭ **CustomPrecompile**: `Exclude`\<`Exclude`\<[`ConstructorArgument`](index.md#constructorargument)\<typeof `_ethereumjs_evm.EVM`\>, `undefined`\>[``"customPrecompiles"``], `undefined`\>[`number`]

Custom precompiles allow you to run arbitrary JavaScript code in the EVM

#### Defined in

evmts-monorepo/packages/precompiles/dist/index.d.ts:16
