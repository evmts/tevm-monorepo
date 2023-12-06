[Documentation](../README.md) / [Modules](../modules.md) / [@tevm/config](tevm_config.md) / loadConfig

# Module: loadConfig

## Table of contents

### Classes

- [LoadConfigError](../classes/tevm_config.loadConfig.LoadConfigError.md)

### Type Aliases

- [LoadConfigErrorType](tevm_config.loadConfig.md#loadconfigerrortype)

### Functions

- [loadConfig](tevm_config.loadConfig.md#loadconfig)

## Type Aliases

### LoadConfigErrorType

Ƭ **LoadConfigErrorType**: `LoadTsConfigError` \| `GetTevmConfigFromTsConfigError` \| `LoadFoundryConfigError`

#### Defined in

[bundler/config/src/loadConfig.js:16](https://github.com/evmts/tevm-monorepo/blob/main/bundler/config/src/loadConfig.js#L16)

## Functions

### loadConfig

▸ **loadConfig**(`configFilePath`): `Effect`\<`never`, [`LoadConfigError`](../classes/tevm_config.loadConfig.LoadConfigError.md), [`ResolvedCompilerConfig`](tevm_config.types.md#resolvedcompilerconfig)\>

Loads an Tevm config from the given path

#### Parameters

| Name | Type |
| :------ | :------ |
| `configFilePath` | `string` |

#### Returns

`Effect`\<`never`, [`LoadConfigError`](../classes/tevm_config.loadConfig.LoadConfigError.md), [`ResolvedCompilerConfig`](tevm_config.types.md#resolvedcompilerconfig)\>

**`Example`**

```ts
import {tap} from 'effect/Effect'
import {loadConfig} from '@tevm/config'

runPromise(loadConfig('./tsconfig.json')).pipe(
  tap(config => console.log(config))
)
```

#### Defined in

[bundler/config/src/loadConfig.js:61](https://github.com/evmts/tevm-monorepo/blob/main/bundler/config/src/loadConfig.js#L61)
