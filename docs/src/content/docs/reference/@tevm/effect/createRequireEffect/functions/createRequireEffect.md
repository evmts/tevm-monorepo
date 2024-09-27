---
editUrl: false
next: false
prev: false
title: "createRequireEffect"
---

> **createRequireEffect**(`url`): `Effect`\<(`id`) => `Effect`\<`any`, [`RequireError`](/reference/tevm/effect/createrequireeffect/classes/requireerror/), `never`\>, [`CreateRequireError`](/reference/tevm/effect/createrequireeffect/classes/createrequireerror/), `never`\>

An [Effect](https://www.effect.website/docs/introduction) wrapper around createRequire
createRequire is used to use the node.js `require` function in esm modules and cjs modules
in a way that is compatible with both. It also wraps them with Effect for better error handling

## Parameters

• **url**: `string`

url to create require from

## Returns

`Effect`\<(`id`) => `Effect`\<`any`, [`RequireError`](/reference/tevm/effect/createrequireeffect/classes/requireerror/), `never`\>, [`CreateRequireError`](/reference/tevm/effect/createrequireeffect/classes/createrequireerror/), `never`\>

require function

## Example

```typescript
import { createRequireEffect } from '@eth-optimism/config'
const requireEffect = createRequireEffect(import.meta.url)
const solcEffect = requireEffect('solc')
```

## See

https://nodejs.org/api/modules.html#modules_module_createrequire_filename

## Defined in

[packages/effect/src/createRequireEffect.js:50](https://github.com/evmts/tevm-monorepo/blob/main/packages/effect/src/createRequireEffect.js#L50)
