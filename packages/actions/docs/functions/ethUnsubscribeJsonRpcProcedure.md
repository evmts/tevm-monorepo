[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / ethUnsubscribeJsonRpcProcedure

# Function: ethUnsubscribeJsonRpcProcedure()

> **ethUnsubscribeJsonRpcProcedure**(`tevmNode`): [`EthUnsubscribeJsonRpcProcedure`](../type-aliases/EthUnsubscribeJsonRpcProcedure.md)

Defined in: [packages/actions/src/eth/ethUnsubscribeProcedure.js:26](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/ethUnsubscribeProcedure.js#L26)

Request handler for eth_unsubscribe JSON-RPC requests.
Cancels an active subscription.

## Parameters

### tevmNode

`TevmNode`\<`"fork"` \| `"normal"`, \{ \}\>

## Returns

[`EthUnsubscribeJsonRpcProcedure`](../type-aliases/EthUnsubscribeJsonRpcProcedure.md)

## Example

```typescript
import { createTevmNode } from '@tevm/node'
import { ethUnsubscribeProcedure } from '@tevm/actions'

const client = createTevmNode()
const procedure = ethUnsubscribeProcedure(client)

const response = await procedure({
  jsonrpc: '2.0',
  method: 'eth_unsubscribe',
  params: ['0x1'],
  id: 1
})
console.log(response.result) // true
```
