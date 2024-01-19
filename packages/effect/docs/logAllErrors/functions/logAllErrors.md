**@tevm/effect** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [logAllErrors](../README.md) > logAllErrors

# Function: logAllErrors()

> **logAllErrors**(`e`): `Effect`\<`never`, `never`, `void`\>

Logs all errors and causes from effect

## Parameters

▪ **e**: `unknown`

## Returns

## Example

```typescript
import { logAllErrors } from '@eth-optimism/config'

someEffect.pipe(
  tapError(logAllErrors)
)

## Source

[packages/effect/src/logAllErrors.js:16](https://github.com/evmts/tevm-monorepo/blob/main/packages/effect/src/logAllErrors.js#L16)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
