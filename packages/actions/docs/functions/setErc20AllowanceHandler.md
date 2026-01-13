[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / setErc20AllowanceHandler

# Function: setErc20AllowanceHandler()

> **setErc20AllowanceHandler**(`node`): [`AnvilSetErc20AllowanceHandler`](../type-aliases/AnvilSetErc20AllowanceHandler.md)

Defined in: [packages/actions/src/anvil/anvilSetErc20AllowanceHandler.js:32](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/anvil/anvilSetErc20AllowanceHandler.js#L32)

Sets ERC20 allowance for a spender by overriding the storage of allowance(owner, spender)

## Parameters

### node

`TevmNode`\<`"fork"` \| `"normal"`, \{ \}\>

## Returns

[`AnvilSetErc20AllowanceHandler`](../type-aliases/AnvilSetErc20AllowanceHandler.md)

## Example

```typescript
import { createTevmNode } from '@tevm/node'
import { setErc20AllowanceHandler } from '@tevm/actions'

const client = createTevmNode()

// Set USDC allowance for a spender to 1000 tokens (6 decimals)
await setErc20AllowanceHandler(client)({
  erc20: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
  owner: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
  spender: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
  amount: 1000000000n
})
```

## Throws

If the storage slot for allowance cannot be found

## Throws

If the access list cannot be created
