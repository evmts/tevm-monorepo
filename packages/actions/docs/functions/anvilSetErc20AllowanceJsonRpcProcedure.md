[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / anvilSetErc20AllowanceJsonRpcProcedure

# Function: anvilSetErc20AllowanceJsonRpcProcedure()

> **anvilSetErc20AllowanceJsonRpcProcedure**(`client`): [`AnvilSetErc20AllowanceProcedure`](../type-aliases/AnvilSetErc20AllowanceProcedure.md)

Defined in: [packages/actions/src/anvil/anvilSetErc20AllowanceProcedure.js:24](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/anvil/anvilSetErc20AllowanceProcedure.js#L24)

JSON-RPC procedure for anvil_setErc20Allowance
Sets ERC20 allowance for a spender by overriding the storage of allowance(owner, spender)

## Parameters

### client

`TevmNode`\<`"fork"` \| `"normal"`, \{ \}\>

## Returns

[`AnvilSetErc20AllowanceProcedure`](../type-aliases/AnvilSetErc20AllowanceProcedure.md)

## Example

```typescript
const response = await client.request({
  method: 'anvil_setErc20Allowance',
  params: [{
    erc20: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', // USDC address
    owner: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
    spender: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
    amount: '0xf4240' // 1000000 (1 USDC with 6 decimals)
  }],
  id: 1,
  jsonrpc: '2.0'
})
```
