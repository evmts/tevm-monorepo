[**@tevm/evm**](../README.md)

***

[@tevm/evm](../globals.md) / EvmType

# Type Alias: EvmType

> **EvmType** = `Omit`\<`EthereumEVM`, `"stateManager"`\> & `object`

Defined in: [packages/evm/src/EvmType.ts:12](https://github.com/evmts/tevm-monorepo/blob/main/packages/evm/src/EvmType.ts#L12)

## Type Declaration

### addCustomPrecompile

> **addCustomPrecompile**: (`precompile`) => `void`

#### Parameters

##### precompile

[`CustomPrecompile`](CustomPrecompile.md)

#### Returns

`void`

### removeCustomPrecompile

> **removeCustomPrecompile**: (`precompile`) => `void`

#### Parameters

##### precompile

[`CustomPrecompile`](CustomPrecompile.md)

#### Returns

`void`

### stateManager

> **stateManager**: `StateManager`
