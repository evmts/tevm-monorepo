[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / anvilAddBalanceJsonRpcProcedure

# Function: anvilAddBalanceJsonRpcProcedure()

> **anvilAddBalanceJsonRpcProcedure**(`client`): [`AnvilAddBalanceProcedure`](../type-aliases/AnvilAddBalanceProcedure.md)

Defined in: [packages/actions/src/anvil/anvilAddBalanceProcedure.js:27](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/anvil/anvilAddBalanceProcedure.js#L27)

Request handler for anvil_addBalance JSON-RPC requests.
Adds to an account's ETH balance (convenience method over anvil_setBalance).

## Parameters

### client

`TevmNode`\<`"fork"` \| `"normal"`, \{ \}\>

## Returns

[`AnvilAddBalanceProcedure`](../type-aliases/AnvilAddBalanceProcedure.md)

## Example

```typescript
import { createTevmNode } from '@tevm/node'
import { anvilAddBalanceJsonRpcProcedure } from '@tevm/actions'

const node = createTevmNode()
const procedure = anvilAddBalanceJsonRpcProcedure(node)

// Add 1 ETH to an account
const result = await procedure({
  jsonrpc: '2.0',
  method: 'anvil_addBalance',
  params: ['0x1234567890123456789012345678901234567890', '0xde0b6b3a7640000'],
  id: 1
})
console.log(result.result) // null
```
