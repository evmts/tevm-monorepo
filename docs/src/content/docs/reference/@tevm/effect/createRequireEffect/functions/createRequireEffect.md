---
editUrl: false
next: false
prev: false
title: "createRequireEffect"
---

`Internal`

> **createRequireEffect**(`url`): `Effect`\<`never`, [`CreateRequireError`](/reference/tevm/effect/createrequireeffect/classes/createrequireerror/), (`id`) => `Effect`\<`never`, [`RequireError`](/reference/tevm/effect/createrequireeffect/classes/requireerror/), `any`\>\>

An [Effect](https://www.effect.website/docs/introduction) wrapper around createRequire
createRequire is used to use the node.js `require` function in esm modules and cjs modules
in a way that is compatible with both. It also wraps them weith Effect for better error handling

## Parameters

• **url**: `string`

url to create require from

## Returns

`Effect`\<`never`, [`CreateRequireError`](/reference/tevm/effect/createrequireeffect/classes/createrequireerror/), (`id`) => `Effect`\<`never`, [`RequireError`](/reference/tevm/effect/createrequireeffect/classes/requireerror/), `any`\>\>

require function

## Example

```typescript
import { createRequireEffect } from '@eth-optimism/config'
const requireEffect = createRequireEffect(import.meta.url)
const solcEffect = requireEffect('solc')
```

## See

https://nodejs.org/api/modules.html#modules_module_createrequire_filename

## Source

[packages/effect/src/createRequireEffect.js:50](https://github.com/evmts/tevm-monorepo/blob/main/packages/effect/src/createRequireEffect.js#L50)
