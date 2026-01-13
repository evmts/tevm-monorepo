[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / ethFeeHistoryHandler

# Function: ethFeeHistoryHandler()

> **ethFeeHistoryHandler**(`client`): [`EthFeeHistoryHandler`](../type-aliases/EthFeeHistoryHandler.md)

Defined in: [packages/actions/src/eth/ethFeeHistoryHandler.js:31](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/ethFeeHistoryHandler.js#L31)

Handler for the `eth_feeHistory` RPC method.
Returns historical gas information, including base fees and priority fees for a range of blocks.

## Parameters

### client

`TevmNode`\<`"fork"` \| `"normal"`, \{ \}\>

## Returns

[`EthFeeHistoryHandler`](../type-aliases/EthFeeHistoryHandler.md)

## Example

```javascript
import { createTevmNode } from '@tevm/node'
import { ethFeeHistoryHandler } from '@tevm/actions'

const node = createTevmNode()
const handler = ethFeeHistoryHandler(node)
const feeHistory = await handler({
  blockCount: 4n,
  newestBlock: 'latest',
  rewardPercentiles: [25, 50, 75],
})
console.log(feeHistory)
// {
//   oldestBlock: 1n,
//   baseFeePerGas: [1000000000n, 1100000000n, 1200000000n, 1300000000n, 1400000000n],
//   gasUsedRatio: [0.5, 0.6, 0.7, 0.8],
//   reward: [[1000000000n, 2000000000n, 3000000000n], ...]
// }
```
