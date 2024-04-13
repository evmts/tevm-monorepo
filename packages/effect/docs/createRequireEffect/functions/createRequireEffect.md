**@tevm/effect** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [createRequireEffect](../README.md) > createRequireEffect

# Function: createRequireEffect()

> **createRequireEffect**(`url`): `Effect`\<`never`, [`CreateRequireError`](../classes/CreateRequireError.md), (`id`) => `Effect`\<`never`, [`RequireError`](../classes/RequireError.md), `any`\>\>

An [Effect](https://www.effect.website/docs/introduction) wrapper around createRequire
createRequire is used to use the node.js `require` function in esm modules and cjs modules
in a way that is compatible with both. It also wraps them weith Effect for better error handling

## Parameters

▪ **url**: `string`

url to create require from

## Returns

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

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
