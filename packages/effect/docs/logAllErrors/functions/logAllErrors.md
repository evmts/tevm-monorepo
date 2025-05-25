[**@tevm/effect**](../../README.md)

***

[@tevm/effect](../../modules.md) / [logAllErrors](../README.md) / logAllErrors

# Function: logAllErrors()

> **logAllErrors**(`e`): `Effect`\<`void`, `never`, `never`\>

Defined in: packages/effect/src/logAllErrors.js:16

**`Internal`**

Logs all errors and causes from effect

## Parameters

### e

`unknown`

## Returns

`Effect`\<`void`, `never`, `never`\>

## Example

```typescript
import { logAllErrors } from '@eth-optimism/config'

someEffect.pipe(
  tapError(logAllErrors)
)
