[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / ethSimulateV1Procedure

# Function: ethSimulateV1Procedure()

> **ethSimulateV1Procedure**(`client`): [`EthSimulateV1JsonRpcProcedure`](../type-aliases/EthSimulateV1JsonRpcProcedure.md)

Defined in: [packages/actions/src/eth/ethSimulateV1Procedure.js:28](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/ethSimulateV1Procedure.js#L28)

JSON-RPC procedure for `eth_simulateV1`.

## Parameters

### client

`TevmNode`\<`"fork"` \| `"normal"`, \{ \}\>

## Returns

[`EthSimulateV1JsonRpcProcedure`](../type-aliases/EthSimulateV1JsonRpcProcedure.md)

## Example

```javascript
import { createTevmNode } from '@tevm/node'
import { ethSimulateV1Procedure } from '@tevm/actions'

const node = createTevmNode()
const procedure = ethSimulateV1Procedure(node)
const response = await procedure({
  jsonrpc: '2.0',
  method: 'eth_simulateV1',
  id: 1,
  params: [{
    blockStateCalls: [{
      calls: [{ from: '0x...', to: '0x...', data: '0x...' }]
    }]
  }],
})
console.log(response.result)
```
