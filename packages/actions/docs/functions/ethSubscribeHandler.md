[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / ethSubscribeHandler

# Function: ethSubscribeHandler()

> **ethSubscribeHandler**(`tevmNode`): [`EthSubscribeHandler`](../type-aliases/EthSubscribeHandler.md)

Defined in: [packages/actions/src/eth/ethSubscribeHandler.js:41](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/ethSubscribeHandler.js#L41)

Creates a subscription for various Ethereum events.
Subscriptions work similar to filters but are typically used with WebSocket transports.
In Tevm, subscriptions are implemented using the same Filter infrastructure as eth_newFilter.

## Parameters

### tevmNode

`TevmNode`\<`"fork"` \| `"normal"`, \{ \}\>

## Returns

[`EthSubscribeHandler`](../type-aliases/EthSubscribeHandler.md)

## Example

```typescript
import { createTevmNode } from '@tevm/node'
import { ethSubscribeHandler } from '@tevm/actions'

const client = createTevmNode()
const subscribe = ethSubscribeHandler(client)

// Subscribe to new block headers
const subscriptionId = await subscribe({ subscriptionType: 'newHeads' })

// Subscribe to logs with filter
const logsSubscriptionId = await subscribe({
  subscriptionType: 'logs',
  filterParams: {
    address: '0x1234567890123456789012345678901234567890',
    topics: ['0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef']
  }
})

// Subscribe to pending transactions
const txSubscriptionId = await subscribe({ subscriptionType: 'newPendingTransactions' })
```
