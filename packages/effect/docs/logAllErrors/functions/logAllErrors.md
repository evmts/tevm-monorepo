**@tevm/effect** • [Readme](../../README.md) \| [API](../../modules.md)

***

[@tevm/effect](../../README.md) / [logAllErrors](../README.md) / logAllErrors

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
import \{ logAllErrors \} from '@eth-optimism/config'

someEffect.pipe(
  tapError(logAllErrors)
)

## Source

[packages/effect/src/logAllErrors.js:16](https://github.com/evmts/tevm-monorepo/blob/main/packages/effect/src/logAllErrors.js#L16)
