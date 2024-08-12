[**@tevm/config**](../../README.md) • **Docs**

***

[@tevm/config](../../modules.md) / [loadConfig](../README.md) / loadConfig

# Function: loadConfig()

> **loadConfig**(`configFilePath`): `Effect`\<`never`, [`LoadConfigError`](../classes/LoadConfigError.md), [`ResolvedCompilerConfig`](../../types/type-aliases/ResolvedCompilerConfig.md)\>

Loads an Tevm config from the given path

## Parameters

• **configFilePath**: `string`

## Returns

`Effect`\<`never`, [`LoadConfigError`](../classes/LoadConfigError.md), [`ResolvedCompilerConfig`](../../types/type-aliases/ResolvedCompilerConfig.md)\>

## Example

```ts
import {tap} from 'effect/Effect'
import {loadConfig} from '@tevm/config'

runPromise(loadConfig('./tsconfig.json')).pipe(
  tap(config => console.log(config))
)
```

## Defined in

[bundler-packages/config/src/loadConfig.js:55](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/config/src/loadConfig.js#L55)
