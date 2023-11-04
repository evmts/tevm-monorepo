[@evmts/effect](../README.md) / [Modules](../modules.md) / logAllErrors

# Module: logAllErrors

## Table of contents

### Functions

- [logAllErrors](logAllErrors.md#logallerrors)

## Functions

### logAllErrors

▸ **logAllErrors**(`e`): `Effect`\<`never`, `never`, `void`\>

Logs all errors and causes from effect

#### Parameters

| Name | Type |
| :------ | :------ |
| `e` | `unknown` |

#### Returns

`Effect`\<`never`, `never`, `void`\>

**`Example`**

```typescript
import { logAllErrors } from '@eth-optimism/config'

someEffect.pipe(
  tapError(logAllErrors)
)

#### Defined in

[packages/effect/src/logAllErrors.js:16](https://github.com/evmts/evmts-monorepo/blob/main/packages/effect/src/logAllErrors.js#L16)
