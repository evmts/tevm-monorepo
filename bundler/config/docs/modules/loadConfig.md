[@evmts/config](../README.md) / [Modules](../modules.md) / loadConfig

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

Ƭ **LoadConfigErrorType**\<\>: `LoadTsConfigError` \| `GetEvmtsConfigFromTsConfigError` \| `LoadFoundryConfigError`

#### Defined in

[bundler/config/src/loadConfig.js:16](https://github.com/evmts/evmts-monorepo/blob/main/bundler/config/src/loadConfig.js#L16)

## Functions

### loadConfig

▸ **loadConfig**(`configFilePath`): `Effect`\<`never`, [`LoadConfigError`](../classes/loadConfig.LoadConfigError.md), [`ResolvedCompilerConfig`](types.md#resolvedcompilerconfig)\>

Loads an EVMts config from the given path

#### Parameters

| Name | Type |
| :------ | :------ |
| `configFilePath` | `string` |

#### Returns

`Effect`\<`never`, [`LoadConfigError`](../classes/loadConfig.LoadConfigError.md), [`ResolvedCompilerConfig`](types.md#resolvedcompilerconfig)\>

**`Example`**

```ts
import {tap} from 'effect/Effect'
import {loadConfig} from '@evmts/config'

runPromise(loadConfig('./tsconfig.json')).pipe(
  tap(config => console.log(config))
)
```

#### Defined in

[bundler/config/src/loadConfig.js:61](https://github.com/evmts/evmts-monorepo/blob/main/bundler/config/src/loadConfig.js#L61)
