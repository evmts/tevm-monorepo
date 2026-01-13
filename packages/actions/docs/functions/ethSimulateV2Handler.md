[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / ethSimulateV2Handler

# Function: ethSimulateV2Handler()

> **ethSimulateV2Handler**(`client`): [`EthSimulateV2Handler`](../type-aliases/EthSimulateV2Handler.md)

Defined in: [packages/actions/src/eth/ethSimulateV2Handler.js:44](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/ethSimulateV2Handler.js#L44)

Handler for the `eth_simulateV2` RPC method.
Simulates multiple transactions across multiple blocks with optional state and block overrides.
Extends V1 with additional features:
- Contract creation detection (emits synthetic logs for deployed contracts)
- Call traces for debugging
- Dynamic gas estimation

## Parameters

### client

`TevmNode`\<`"fork"` \| `"normal"`, \{ \}\>

## Returns

[`EthSimulateV2Handler`](../type-aliases/EthSimulateV2Handler.md)

## Example

```javascript
import { createTevmNode } from '@tevm/node'
import { ethSimulateV2Handler } from '@tevm/actions'

const node = createTevmNode()
const handler = ethSimulateV2Handler(node)
const result = await handler({
  blockStateCalls: [
    {
      calls: [
        { from: '0x...', to: '0x...', data: '0x...' }
      ]
    }
  ],
  includeContractCreationEvents: true,
  includeCallTraces: true
})
console.log(result)
```
