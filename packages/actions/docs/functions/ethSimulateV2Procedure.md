[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / ethSimulateV2Procedure

# Function: ethSimulateV2Procedure()

> **ethSimulateV2Procedure**(`client`): [`EthSimulateV2JsonRpcProcedure`](../type-aliases/EthSimulateV2JsonRpcProcedure.md)

Defined in: [packages/actions/src/eth/ethSimulateV2Procedure.js:31](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/ethSimulateV2Procedure.js#L31)

JSON-RPC procedure for `eth_simulateV2`.
Extends V1 with additional features for contract creation detection and call tracing.

## Parameters

### client

`TevmNode`\<`"fork"` \| `"normal"`, \{ \}\>

## Returns

[`EthSimulateV2JsonRpcProcedure`](../type-aliases/EthSimulateV2JsonRpcProcedure.md)

## Example

```javascript
import { createTevmNode } from '@tevm/node'
import { ethSimulateV2Procedure } from '@tevm/actions'

const node = createTevmNode()
const procedure = ethSimulateV2Procedure(node)
const response = await procedure({
  jsonrpc: '2.0',
  method: 'eth_simulateV2',
  id: 1,
  params: [{
    blockStateCalls: [{
      calls: [{ from: '0x...', to: '0x...', data: '0x...' }]
    }],
    includeContractCreationEvents: true,
    includeCallTraces: true
  }],
})
console.log(response.result)
```
