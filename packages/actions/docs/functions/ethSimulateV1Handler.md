[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / ethSimulateV1Handler

# Function: ethSimulateV1Handler()

> **ethSimulateV1Handler**(`client`): [`EthSimulateV1Handler`](../type-aliases/EthSimulateV1Handler.md)

Defined in: [packages/actions/src/eth/ethSimulateV1Handler.js:30](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/ethSimulateV1Handler.js#L30)

Handler for the `eth_simulateV1` RPC method.
Simulates multiple transactions across multiple blocks with optional state and block overrides.

## Parameters

### client

`TevmNode`\<`"fork"` \| `"normal"`, \{ \}\>

## Returns

[`EthSimulateV1Handler`](../type-aliases/EthSimulateV1Handler.md)

## Example

```javascript
import { createTevmNode } from '@tevm/node'
import { ethSimulateV1Handler } from '@tevm/actions'

const node = createTevmNode()
const handler = ethSimulateV1Handler(node)
const result = await handler({
  blockStateCalls: [
    {
      calls: [
        { from: '0x...', to: '0x...', data: '0x...' }
      ]
    }
  ]
})
console.log(result)
```
