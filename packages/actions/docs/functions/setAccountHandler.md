[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / setAccountHandler

# Function: setAccountHandler()

> **setAccountHandler**(`client`, `options`?): [`SetAccountHandler`](../type-aliases/SetAccountHandler.md)

Defined in: [packages/actions/src/SetAccount/setAccountHandler.js:71](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/SetAccount/setAccountHandler.js#L71)

Creates a handler for setting account state in the Ethereum Virtual Machine

This handler allows you to completely modify an account's state, including:
- Setting account balance and nonce
- Deploying contract bytecode
- Modifying contract storage
- Setting storage roots directly

It's particularly useful for test environments where you need to set up
specific contract states or account balances before running tests.

## Parameters

### client

`TevmNode`\<`"fork"` \| `"normal"`, \{\}\>

The TEVM node instance

### options?

Handler configuration options

#### throwOnFail?

`boolean`

Whether to throw errors or return them in the result object

## Returns

[`SetAccountHandler`](../type-aliases/SetAccountHandler.md)

A handler function for setting account state

## Throws

When validation fails and throwOnFail is true

## Throws

When there's an error putting the account state and throwOnFail is true

## Example

```javascript
import { createTevmNode } from '@tevm/node'
import { setAccountHandler } from '@tevm/actions'
import { parseEther } from 'viem'

const node = createTevmNode()
const handler = setAccountHandler(node)

// Set an account with balance and nonce
await handler({
  address: '0x1234567890123456789012345678901234567890',
  balance: parseEther('1000'), // 1000 ETH
  nonce: 5n
})

// Deploy contract bytecode
await handler({
  address: '0xabcdef1234567890abcdef1234567890abcdef12',
  deployedBytecode: '0x608060405234801561001057600080fd5b50600436106100365760003560e01c8063...',
  balance: parseEther('10')
})

// Set specific storage values
await handler({
  address: '0xabcdef1234567890abcdef1234567890abcdef12',
  state: {
    // storage slot => value
    '0x0000000000000000000000000000000000000000000000000000000000000000': '0x0000000000000000000000000000000000000000000000000000000000000001',
    '0x0000000000000000000000000000000000000000000000000000000000000001': '0x0000000000000000000000000000000000000000000000000000000000000002'
  }
})

// Update individual storage slots without clearing others
await handler({
  address: '0xabcdef1234567890abcdef1234567890abcdef12',
  stateDiff: {
    '0x0000000000000000000000000000000000000000000000000000000000000000': '0x0000000000000000000000000000000000000000000000000000000000000005'
  }
})
```
