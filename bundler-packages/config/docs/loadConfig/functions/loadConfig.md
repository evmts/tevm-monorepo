[**@tevm/config**](../../README.md)

***

[@tevm/config](../../modules.md) / [loadConfig](../README.md) / loadConfig

# Function: loadConfig()

> **loadConfig**(`configFilePath`): `Effect`\<[`ResolvedCompilerConfig`](../../types/type-aliases/ResolvedCompilerConfig.md), [`LoadConfigError`](../classes/LoadConfigError.md), `never`\>

Defined in: [bundler-packages/config/src/loadConfig.js:55](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/config/src/loadConfig.js#L55)

Loads an Tevm config from the given path

## Parameters

### configFilePath

`string`

## Returns

`Effect`\<[`ResolvedCompilerConfig`](../../types/type-aliases/ResolvedCompilerConfig.md), [`LoadConfigError`](../classes/LoadConfigError.md), `never`\>

## Example

```ts
import {tap} from 'effect/Effect'
import {loadConfig} from '@tevm/config'

runPromise(loadConfig('./tsconfig.json')).pipe(
  tap(config => console.log(config))
)
```
