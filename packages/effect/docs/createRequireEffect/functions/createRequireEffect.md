[**@tevm/effect**](../../README.md)

***

[@tevm/effect](../../modules.md) / [createRequireEffect](../README.md) / createRequireEffect

# Function: createRequireEffect()

> **createRequireEffect**(`url`): `Effect`\<(`id`) => `Effect`\<`any`, [`RequireError`](../classes/RequireError.md), `never`\>, [`CreateRequireError`](../classes/CreateRequireError.md), `never`\>

Defined in: [packages/effect/src/createRequireEffect.js:50](https://github.com/evmts/tevm-monorepo/blob/main/packages/effect/src/createRequireEffect.js#L50)

**`Internal`**

An [Effect](https://www.effect.website/docs/introduction) wrapper around createRequire
createRequire is used to use the node.js `require` function in esm modules and cjs modules
in a way that is compatible with both. It also wraps them with Effect for better error handling

## Parameters

### url

`string`

url to create require from

## Returns

`Effect`\<(`id`) => `Effect`\<`any`, [`RequireError`](../classes/RequireError.md), `never`\>, [`CreateRequireError`](../classes/CreateRequireError.md), `never`\>

require function

## Example

```typescript
import { createRequireEffect } from '@eth-optimism/config'
const requireEffect = createRequireEffect(import.meta.url)
const solcEffect = requireEffect('solc')
```

## See

https://nodejs.org/api/modules.html#modules_module_createrequire_filename
