[Documentation](../README.md) / [Modules](../modules.md) / [@evmts/effect](evmts_effect.md) / createRequireEffect

# Module: createRequireEffect

## Table of contents

### Classes

- [CreateRequireError](../classes/evmts_effect.createRequireEffect.CreateRequireError.md)
- [RequireError](../classes/evmts_effect.createRequireEffect.RequireError.md)

### Functions

- [createRequireEffect](evmts_effect.createRequireEffect.md#createrequireeffect)

## Functions

### createRequireEffect

▸ **createRequireEffect**(`url`): `Effect`\<`never`, [`CreateRequireError`](../classes/evmts_effect.createRequireEffect.CreateRequireError.md), (`id`: `string`) => `Effect`\<`never`, [`RequireError`](../classes/evmts_effect.createRequireEffect.RequireError.md), `any`\>\>

An [Effect](https://www.effect.website/docs/introduction) wrapper around createRequire
createRequire is used to use the node.js `require` function in esm modules and cjs modules
in a way that is compatible with both. It also wraps them weith Effect for better error handling

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `url` | `string` | url to create require from |

#### Returns

`Effect`\<`never`, [`CreateRequireError`](../classes/evmts_effect.createRequireEffect.CreateRequireError.md), (`id`: `string`) => `Effect`\<`never`, [`RequireError`](../classes/evmts_effect.createRequireEffect.RequireError.md), `any`\>\>

require function

**`Example`**

```typescript
import { createRequireEffect } from '@eth-optimism/config'
const requireEffect = createRequireEffect(import.meta.url)
const solcEffect = requireEffect('solc')
```

**`See`**

https://nodejs.org/api/modules.html#modules_module_createrequire_filename

#### Defined in

[packages/effect/src/createRequireEffect.js:50](https://github.com/evmts/evmts-monorepo/blob/main/packages/effect/src/createRequireEffect.js#L50)
