[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / ethFeeHistoryProcedure

# Function: ethFeeHistoryProcedure()

> **ethFeeHistoryProcedure**(`client`): [`EthFeeHistoryJsonRpcProcedure`](../type-aliases/EthFeeHistoryJsonRpcProcedure.md)

Defined in: [packages/actions/src/eth/ethFeeHistoryProcedure.js:30](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/ethFeeHistoryProcedure.js#L30)

JSON-RPC procedure for `eth_feeHistory`.

## Parameters

### client

`TevmNode`\<`"fork"` \| `"normal"`, \{ \}\>

## Returns

[`EthFeeHistoryJsonRpcProcedure`](../type-aliases/EthFeeHistoryJsonRpcProcedure.md)

## Example

```javascript
import { createTevmNode } from '@tevm/node'
import { ethFeeHistoryProcedure } from '@tevm/actions'

const node = createTevmNode()
const procedure = ethFeeHistoryProcedure(node)
const response = await procedure({
  jsonrpc: '2.0',
  method: 'eth_feeHistory',
  id: 1,
  params: ['0x4', 'latest', [25, 50, 75]],
})
console.log(response.result)
// {
//   oldestBlock: '0x1',
//   baseFeePerGas: ['0x3b9aca00', ...],
//   gasUsedRatio: [0.5, ...],
//   reward: [['0x3b9aca00', ...], ...]
// }
```
