[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [evm](../README.md) / EvmType

# Type Alias: EvmType

> **EvmType** = `Omit`\<`EVM`, `"stateManager"`\> & `object`

## Type Declaration

### addCustomPrecompile

> **addCustomPrecompile**: (`precompile`) => `void`

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `precompile` | [`CustomPrecompile`](CustomPrecompile.md) |

#### Returns

`void`

### removeCustomPrecompile

> **removeCustomPrecompile**: (`precompile`) => `void`

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `precompile` | [`CustomPrecompile`](CustomPrecompile.md) |

#### Returns

`void`

### stateManager

> **stateManager**: [`StateManager`](../../state/interfaces/StateManager.md)
