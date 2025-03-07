[**@tevm/actions**](../README.md) • **Docs**

***

[@tevm/actions](../globals.md) / anvilDealJsonRpcProcedure

# Function: anvilDealJsonRpcProcedure()

> **anvilDealJsonRpcProcedure**(`client`): [`AnvilDealProcedure`](../type-aliases/AnvilDealProcedure.md)

JSON-RPC procedure for anvil_deal
Deals ERC20 tokens to an account by overriding the storage of balanceOf(account)

## Parameters

• **client**: `TevmNode`\<`"fork"` \| `"normal"`, `object`\>

## Returns

[`AnvilDealProcedure`](../type-aliases/AnvilDealProcedure.md)

## Example

```typescript
const response = await client.request({
  method: 'anvil_deal',
  params: [{
    erc20: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', // Optional: USDC address
    account: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
    amount: 1000000n // 1 USDC (6 decimals)
  }],
  id: 1,
  jsonrpc: '2.0'
})
```

## Defined in

[packages/actions/src/anvil/anvilDealProcedure.js:23](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/anvil/anvilDealProcedure.js#L23)
