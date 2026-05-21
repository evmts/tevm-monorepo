[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [evm](../README.md) / EvmType

# Type Alias: EvmType

> **EvmType** = `Omit`\<`EVM`, `"stateManager"`\> & `object`

Defined in: tevm-monorepo/packages/evm/dist/index.d.ts:185

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

> **stateManager**: [`StateManager`](../../state/interfaces/StateManager.md)
