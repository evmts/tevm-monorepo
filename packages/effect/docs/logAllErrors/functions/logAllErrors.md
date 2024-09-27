[**@tevm/effect**](../../README.md) • **Docs**

***

[@tevm/effect](../../modules.md) / [logAllErrors](../README.md) / logAllErrors

# Function: logAllErrors()

> **logAllErrors**(`e`): `Effect`\<`void`, `never`, `never`\>

Logs all errors and causes from effect

## Parameters

• **e**: `unknown`

## Returns

`Effect`\<`void`, `never`, `never`\>

## Example

```typescript
import { logAllErrors } from '@eth-optimism/config'

someEffect.pipe(
  tapError(logAllErrors)
)

## Defined in

[packages/effect/src/logAllErrors.js:16](https://github.com/evmts/tevm-monorepo/blob/main/packages/effect/src/logAllErrors.js#L16)
