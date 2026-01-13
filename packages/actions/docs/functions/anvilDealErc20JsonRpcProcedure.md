[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / anvilDealErc20JsonRpcProcedure

# Function: anvilDealErc20JsonRpcProcedure()

> **anvilDealErc20JsonRpcProcedure**(`client`): [`AnvilDealErc20Procedure`](../type-aliases/AnvilDealErc20Procedure.md)

Defined in: [packages/actions/src/anvil/anvilDealErc20Procedure.js:23](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/anvil/anvilDealErc20Procedure.js#L23)

JSON-RPC procedure for anvil_dealErc20
Sets ERC20 token balance for an account by overriding the storage of balanceOf(account)

## Parameters

### client

`TevmNode`\<`"fork"` \| `"normal"`, \{ \}\>

## Returns

[`AnvilDealErc20Procedure`](../type-aliases/AnvilDealErc20Procedure.md)

## Example

```typescript
const response = await client.request({
  method: 'anvil_dealErc20',
  params: [{
    erc20: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', // USDC address
    account: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
    amount: '0xf4240' // 1000000 (1 USDC with 6 decimals)
  }],
  id: 1,
  jsonrpc: '2.0'
})
```
