[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / maxPriorityFeePerGasHandler

# Function: maxPriorityFeePerGasHandler()

> **maxPriorityFeePerGasHandler**(`client`): [`EthMaxPriorityFeePerGasHandler`](../type-aliases/EthMaxPriorityFeePerGasHandler.md)

Defined in: [packages/actions/src/eth/maxPriorityFeePerGasHandler.js:21](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/maxPriorityFeePerGasHandler.js#L21)

Handler for the `eth_maxPriorityFeePerGas` RPC method.
Returns the current maximum priority fee per gas (tip).

## Parameters

### client

`TevmNode`\<`"fork"` \| `"normal"`, \{ \}\>

## Returns

[`EthMaxPriorityFeePerGasHandler`](../type-aliases/EthMaxPriorityFeePerGasHandler.md)

## Example

```javascript
import { createTevmNode } from '@tevm/node'
import { maxPriorityFeePerGasHandler } from '@tevm/actions'

const node = createTevmNode()
const handler = maxPriorityFeePerGasHandler(node)
const maxPriorityFeePerGas = await handler()
console.log(maxPriorityFeePerGas) // e.g., 1000000000n (1 gwei)
```
