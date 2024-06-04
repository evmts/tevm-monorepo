[**@tevm/effect**](../../README.md) • **Docs**

***

[@tevm/effect](../../modules.md) / [logAllErrors](../README.md) / logAllErrors

# Function: logAllErrors()

`Internal`

> **logAllErrors**(`e`): `Effect`\<`never`, `never`, `void`\>

Logs all errors and causes from effect

## Parameters

• **e**: `unknown`

## Returns

`Effect`\<`never`, `never`, `void`\>

## Example

```typescript
import { logAllErrors } from '@eth-optimism/config'

someEffect.pipe(
  tapError(logAllErrors)
)

## Source

bundler-packages/effect/src/logAllErrors.js:16
