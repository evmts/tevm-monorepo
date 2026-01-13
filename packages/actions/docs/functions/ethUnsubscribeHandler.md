[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / ethUnsubscribeHandler

# Function: ethUnsubscribeHandler()

> **ethUnsubscribeHandler**(`tevmNode`): [`EthUnsubscribeHandler`](../type-aliases/EthUnsubscribeHandler.md)

Defined in: [packages/actions/src/eth/ethUnsubscribeHandler.js:24](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/ethUnsubscribeHandler.js#L24)

Cancels an active subscription.
This handler removes the subscription and cleans up any associated event listeners.

## Parameters

### tevmNode

`TevmNode`\<`"fork"` \| `"normal"`, \{ \}\>

## Returns

[`EthUnsubscribeHandler`](../type-aliases/EthUnsubscribeHandler.md)

## Example

```typescript
import { createTevmNode } from '@tevm/node'
import { ethSubscribeHandler, ethUnsubscribeHandler } from '@tevm/actions'

const client = createTevmNode()
const subscribe = ethSubscribeHandler(client)
const unsubscribe = ethUnsubscribeHandler(client)

// Create a subscription
const subscriptionId = await subscribe({ subscriptionType: 'newHeads' })

// Later, cancel the subscription
const success = await unsubscribe({ subscriptionId })
console.log(success) // true if subscription existed, false otherwise
```
