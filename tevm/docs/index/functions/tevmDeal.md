[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / tevmDeal

# Function: tevmDeal()

> **tevmDeal**(`node`): [`AnvilDealHandler`](../../actions/type-aliases/AnvilDealHandler.md)

Defined in: packages/memory-client/types/tevmDeal.d.ts:33

Creates a tevmDeal action for the client that lets you deal tokens to an account

Supports two modes:
1. For native ETH: When no `erc20` address is provided, it sets the account balance
2. For ERC20 tokens: When an `erc20` address is provided, it finds and updates the correct storage slot

## Parameters

### node

[`TevmNode`](../type-aliases/TevmNode.md)

## Returns

[`AnvilDealHandler`](../../actions/type-aliases/AnvilDealHandler.md)

## Examples

```typescript
import { createMemoryClient } from 'tevm'

const client = createMemoryClient()
await client.tevmDeal({
  account: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
  amount: 1000000000000000000n // 1 ETH
})
```

```typescript
import { createMemoryClient } from 'tevm'

const client = createMemoryClient()
await client.tevmDeal({
  erc20: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', // USDC address
  account: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
  amount: 1000000n // 1 USDC (6 decimals)
})
```
