[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / dealHandler

# Function: dealHandler()

> **dealHandler**(`client`): [`AnvilDealHandler`](../type-aliases/AnvilDealHandler.md)

Defined in: [packages/actions/src/anvil/anvilDealHandler.js:53](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/anvil/anvilDealHandler.js#L53)

Deals tokens to an account, supporting both native ETH and ERC20 tokens

This handler provides two modes of operation:
1. For native ETH: When no `erc20` address is provided, it sets the account balance to the specified amount
2. For ERC20 tokens: When an `erc20` address is provided, it finds the correct storage slot for the token balance and updates it

The ERC20 token dealing works by:
- Using eth_createAccessList to find all storage slots accessed during a balanceOf call
- Testing each storage slot by updating it and checking if the balance is changed
- Resetting any incorrect slots and only keeping the correct balance update

## Parameters

### client

`TevmNode`\<`"fork"` \| `"normal"`, \{\}\>

The Tevm node instance

## Returns

[`AnvilDealHandler`](../type-aliases/AnvilDealHandler.md)

A function that handles dealing tokens and returns a Promise with either an empty object on success or an errors array if no valid storage slot is found

## Examples

```typescript
import { createTevmNode } from 'tevm'
import { dealHandler } from 'tevm/actions'

const client = createTevmNode()
await dealHandler(client)({
  account: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
  amount: 1000000000000000000n // 1 ETH
})
```

```typescript
import { createTevmNode } from 'tevm'
import { dealHandler } from 'tevm/actions'

const client = createTevmNode()
await dealHandler(client)({
  erc20: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', // USDC address
  account: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
  amount: 1000000n // 1 USDC (6 decimals)
})
```

## Throws

If the access list cannot be retrieved
