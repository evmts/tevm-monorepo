---
editUrl: false
next: false
prev: false
title: "DefineConfig"
---

> **DefineConfig**: (`configFactory`) => `object`

Creates an Tevm config
Takes a user provided configFactory

## Parameters

• **configFactory**: [`ConfigFactory`](/reference/tevm/config/types/type-aliases/configfactory/)

## Returns

`object`

### configFn()

> **configFn**: (`configFilePath`) => `Effect`\<[`ResolvedCompilerConfig`](/reference/tevm/config/types/type-aliases/resolvedcompilerconfig/), [`DefineConfigError`](/reference/tevm/config/defineconfig/classes/defineconfigerror/), `never`\>

#### Parameters

• **configFilePath**: `string`

#### Returns

`Effect`\<[`ResolvedCompilerConfig`](/reference/tevm/config/types/type-aliases/resolvedcompilerconfig/), [`DefineConfigError`](/reference/tevm/config/defineconfig/classes/defineconfigerror/), `never`\>

## Example

```ts
import { defineConfig } from 'tevm/config'
export default defineConfig({
	foundryProject: true,
		libs: ['libs/contracts'],
	})
```

## Defined in

[bundler-packages/config/src/types.ts:92](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/config/src/types.ts#L92)
