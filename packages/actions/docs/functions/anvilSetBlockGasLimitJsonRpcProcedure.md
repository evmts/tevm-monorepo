[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / anvilSetBlockGasLimitJsonRpcProcedure

# Function: anvilSetBlockGasLimitJsonRpcProcedure()

> **anvilSetBlockGasLimitJsonRpcProcedure**(`client`): [`AnvilSetBlockGasLimitProcedure`](../type-aliases/AnvilSetBlockGasLimitProcedure.md)

Defined in: [packages/actions/src/anvil/anvilSetBlockGasLimitProcedure.js:29](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/anvil/anvilSetBlockGasLimitProcedure.js#L29)

Request handler for anvil_setBlockGasLimit JSON-RPC requests.
Sets the gas limit for all subsequent blocks (persists across blocks).

## Parameters

### client

`TevmNode`\<`"fork"` \| `"normal"`, \{ \}\>

## Returns

[`AnvilSetBlockGasLimitProcedure`](../type-aliases/AnvilSetBlockGasLimitProcedure.md)

## Example

```typescript
import { createTevmNode } from '@tevm/node'
import { anvilSetBlockGasLimitJsonRpcProcedure } from '@tevm/actions'

const client = createTevmNode()
const procedure = anvilSetBlockGasLimitJsonRpcProcedure(client)

const result = await procedure({
  jsonrpc: '2.0',
  method: 'anvil_setBlockGasLimit',
  params: ['0xE4E1C0'], // 15,000,000 in hex
  id: 1,
})
// result: { jsonrpc: '2.0', method: 'anvil_setBlockGasLimit', result: null, id: 1 }

// All subsequent blocks will have this gas limit
await client.tevmMine()
const block = await client.getVm().then(vm => vm.blockchain.getCanonicalHeadBlock())
console.log(block.header.gasLimit) // 15000000n
```
