[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / setAccountHandler

# Function: setAccountHandler()

> **setAccountHandler**(`client`, `options?`): [`SetAccountHandler`](../type-aliases/SetAccountHandler.md)

Defined in: [packages/actions/src/SetAccount/setAccountHandler.js:47](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/SetAccount/setAccountHandler.js#L47)

Creates a handler for setting account state in the Ethereum Virtual Machine

This handler allows you to completely modify an account's state, including:
- Setting account balance and nonce
- Deploying contract bytecode
- Modifying contract storage
- Setting storage roots directly

It's particularly useful for test environments where you need to set up
specific contract states or account balances before running tests.

Use `state` to overwrite the account's storage (clears existing slots first) or
`stateDiff` to patch individual slots without clearing.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `client` | `TevmNode`\<`"fork"` \| `"normal"`, \{ \}\> | - |
| `options?` | \{ `throwOnFail?`: `boolean`; \} | - |
| `options.throwOnFail?` | `boolean` | - |

## Returns

[`SetAccountHandler`](../type-aliases/SetAccountHandler.md)

## Throws

When validation fails and throwOnFail is true.

## Throws

When putting account state fails and throwOnFail is true.

## Example

```javascript
import { createTevmNode } from '@tevm/node'
import { setAccountHandler } from '@tevm/actions'
import { parseEther } from 'viem'

const handler = setAccountHandler(createTevmNode())
await handler({
  address: '0x1234567890123456789012345678901234567890',
  balance: parseEther('1000'),
  nonce: 5n,
  deployedBytecode: '0x6080...',
  stateDiff: { '0x00...00': '0x00...05' },
})
```
