[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / dealErc20Handler

# Function: dealErc20Handler()

> **dealErc20Handler**(`node`): [`AnvilDealErc20Handler`](../type-aliases/AnvilDealErc20Handler.md)

Defined in: [packages/actions/src/anvil/anvilDealErc20Handler.js:32](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/anvil/anvilDealErc20Handler.js#L32)

Sets ERC20 token balance for an account by overriding the storage of balanceOf(account)
This is a specialized version of anvil_deal for ERC20 tokens only

## Parameters

### node

`TevmNode`\<`"fork"` \| `"normal"`, \{ \}\>

## Returns

[`AnvilDealErc20Handler`](../type-aliases/AnvilDealErc20Handler.md)

## Example

```typescript
import { createTevmNode } from '@tevm/node'
import { dealErc20Handler } from '@tevm/actions'

const client = createTevmNode()

// Set USDC balance to 1000 tokens (6 decimals)
await dealErc20Handler(client)({
  erc20: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
  account: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
  amount: 1000000000n
})
```

## Throws

If the storage slot for balanceOf cannot be found

## Throws

If the access list cannot be created
