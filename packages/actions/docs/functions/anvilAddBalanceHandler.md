[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / anvilAddBalanceHandler

# Function: anvilAddBalanceHandler()

> **anvilAddBalanceHandler**(`node`): [`AnvilAddBalanceHandler`](../type-aliases/AnvilAddBalanceHandler.md)

Defined in: [packages/actions/src/anvil/anvilAddBalanceHandler.js:27](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/anvil/anvilAddBalanceHandler.js#L27)

Handler for anvil_addBalance - adds to an account's ETH balance
This is a convenience method that reads the current balance, adds the amount,
and sets the new balance.

## Parameters

### node

`TevmNode`\<`"fork"` \| `"normal"`, \{ \}\>

## Returns

[`AnvilAddBalanceHandler`](../type-aliases/AnvilAddBalanceHandler.md)

## Throws

if setting the balance fails

## Example

```typescript
import { createTevmNode } from '@tevm/node'
import { anvilAddBalanceHandler } from '@tevm/actions'

const node = createTevmNode()
const handler = anvilAddBalanceHandler(node)

// Add 1 ETH to an account
await handler({
  address: '0x1234567890123456789012345678901234567890',
  amount: 1000000000000000000n // 1 ETH in wei
})
```
