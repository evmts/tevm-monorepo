---
editUrl: false
next: false
prev: false
title: "loadConfig"
---

> **loadConfig**(`configFilePath`): `Effect`\<[`ResolvedCompilerConfig`](/reference/tevm/config/types/type-aliases/resolvedcompilerconfig/), [`LoadConfigError`](/reference/tevm/config/loadconfig/classes/loadconfigerror/), `never`\>

Loads an Tevm config from the given path

## Parameters

• **configFilePath**: `string`

## Returns

`Effect`\<[`ResolvedCompilerConfig`](/reference/tevm/config/types/type-aliases/resolvedcompilerconfig/), [`LoadConfigError`](/reference/tevm/config/loadconfig/classes/loadconfigerror/), `never`\>

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
