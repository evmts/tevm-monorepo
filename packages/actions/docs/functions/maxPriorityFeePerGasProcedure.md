[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / maxPriorityFeePerGasProcedure

# Function: maxPriorityFeePerGasProcedure()

> **maxPriorityFeePerGasProcedure**(`options`): [`EthMaxPriorityFeePerGasJsonRpcProcedure`](../type-aliases/EthMaxPriorityFeePerGasJsonRpcProcedure.md)

Defined in: [packages/actions/src/eth/maxPriorityFeePerGasProcedure.js:25](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/maxPriorityFeePerGasProcedure.js#L25)

JSON-RPC procedure for `eth_maxPriorityFeePerGas`.

## Parameters

### options

`TevmNode`\<`"fork"` \| `"normal"`, \{ \}\>

## Returns

[`EthMaxPriorityFeePerGasJsonRpcProcedure`](../type-aliases/EthMaxPriorityFeePerGasJsonRpcProcedure.md)

## Example

```javascript
import { createTevmNode } from '@tevm/node'
import { maxPriorityFeePerGasProcedure } from '@tevm/actions'

const node = createTevmNode()
const procedure = maxPriorityFeePerGasProcedure(node)
const response = await procedure({
  jsonrpc: '2.0',
  method: 'eth_maxPriorityFeePerGas',
  id: 1,
  params: [],
})
console.log(response.result) // e.g., '0x3b9aca00' (1 gwei in hex)
```
