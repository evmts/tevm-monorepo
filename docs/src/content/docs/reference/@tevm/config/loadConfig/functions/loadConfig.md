---
editUrl: false
next: false
prev: false
title: "loadConfig"
---

> **loadConfig**(`configFilePath`): `Effect`\<`never`, [`LoadConfigError`](/reference/tevm/config/loadconfig/classes/loadconfigerror/), [`ResolvedCompilerConfig`](/reference/tevm/config/types/type-aliases/resolvedcompilerconfig/)\>

Loads an Tevm config from the given path

## Parameters

• **configFilePath**: `string`

## Returns

`Effect`\<`never`, [`LoadConfigError`](/reference/tevm/config/loadconfig/classes/loadconfigerror/), [`ResolvedCompilerConfig`](/reference/tevm/config/types/type-aliases/resolvedcompilerconfig/)\>

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
