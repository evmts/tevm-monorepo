**@tevm/config** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [loadConfig](../README.md) > loadConfig

# Function: loadConfig()

> **loadConfig**(`configFilePath`): `Effect`\<`never`, [`LoadConfigError`](../classes/LoadConfigError.md), [`ResolvedCompilerConfig`](../../types/type-aliases/ResolvedCompilerConfig.md)\>

Loads an Tevm config from the given path

## Parameters

▪ **configFilePath**: `string`

## Returns

## Example

```ts
import {tap} from 'effect/Effect'
import {loadConfig} from '@tevm/config'

runPromise(loadConfig('./tsconfig.json')).pipe(
  tap(config => console.log(config))
)
```

## Source

[bundler-packages/config/src/loadConfig.js:54](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/config/src/loadConfig.js#L54)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
