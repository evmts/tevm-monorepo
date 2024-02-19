[@tevm/config](../README.md) / [Modules](../modules.md) / loadConfig

# Module: loadConfig

## Table of contents

### Classes

- [LoadConfigError](../classes/loadConfig.LoadConfigError.md)

### Type Aliases

- [LoadConfigErrorType](loadConfig.md#loadconfigerrortype)

### Functions

- [loadConfig](loadConfig.md#loadconfig)

## Type Aliases

### LoadConfigErrorType

Ƭ **LoadConfigErrorType**\<\>: `LoadTsConfigError` \| `GetTevmConfigFromTsConfigError` \| `LoadFoundryConfigError` \| `InvalidJsonConfigError`

#### Defined in

[evmts-monorepo/bundler-packages/config/src/loadConfig.js:20](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/config/src/loadConfig.js#L20)

## Functions

### loadConfig

▸ **loadConfig**(`configFilePath`): `Effect`\<`never`, [`LoadConfigError`](../classes/loadConfig.LoadConfigError.md), [`ResolvedCompilerConfig`](types.md#resolvedcompilerconfig)\>

Loads an Tevm config from the given path

#### Parameters

| Name | Type |
| :------ | :------ |
| `configFilePath` | `string` |

#### Returns

`Effect`\<`never`, [`LoadConfigError`](../classes/loadConfig.LoadConfigError.md), [`ResolvedCompilerConfig`](types.md#resolvedcompilerconfig)\>

**`Example`**

```ts
import {tap} from 'effect/Effect'
import {loadConfig} from '@tevm/config'

runPromise(loadConfig('./tsconfig.json')).pipe(
  tap(config => console.log(config))
)
```

#### Defined in

[evmts-monorepo/bundler-packages/config/src/loadConfig.js:65](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/config/src/loadConfig.js#L65)
