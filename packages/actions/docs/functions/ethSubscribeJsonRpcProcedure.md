[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / ethSubscribeJsonRpcProcedure

# Function: ethSubscribeJsonRpcProcedure()

> **ethSubscribeJsonRpcProcedure**(`tevmNode`): [`EthSubscribeJsonRpcProcedure`](../type-aliases/EthSubscribeJsonRpcProcedure.md)

Defined in: [packages/actions/src/eth/ethSubscribeProcedure.js:26](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/ethSubscribeProcedure.js#L26)

Request handler for eth_subscribe JSON-RPC requests.
Creates a subscription for various Ethereum events.

## Parameters

### tevmNode

`TevmNode`\<`"fork"` \| `"normal"`, \{ \}\>

## Returns

[`EthSubscribeJsonRpcProcedure`](../type-aliases/EthSubscribeJsonRpcProcedure.md)

## Example

```typescript
import { createTevmNode } from '@tevm/node'
import { ethSubscribeProcedure } from '@tevm/actions'

const client = createTevmNode()
const procedure = ethSubscribeProcedure(client)

const response = await procedure({
  jsonrpc: '2.0',
  method: 'eth_subscribe',
  params: ['newHeads'],
  id: 1
})
console.log(response.result) // '0x1'
```
