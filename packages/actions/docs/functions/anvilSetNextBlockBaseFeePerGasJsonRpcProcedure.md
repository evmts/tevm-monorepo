[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / anvilSetNextBlockBaseFeePerGasJsonRpcProcedure

# Function: anvilSetNextBlockBaseFeePerGasJsonRpcProcedure()

> **anvilSetNextBlockBaseFeePerGasJsonRpcProcedure**(`client`): [`AnvilSetNextBlockBaseFeePerGasProcedure`](../type-aliases/AnvilSetNextBlockBaseFeePerGasProcedure.md)

Defined in: [packages/actions/src/anvil/anvilSetNextBlockBaseFeePerGasProcedure.js:35](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/anvil/anvilSetNextBlockBaseFeePerGasProcedure.js#L35)

Request handler for anvil_setNextBlockBaseFeePerGas JSON-RPC requests.
Sets the base fee per gas for the next block only (EIP-1559).
After the next block is mined, the base fee will revert to being calculated automatically.

## Parameters

### client

`TevmNode`\<`"fork"` \| `"normal"`, \{ \}\>

## Returns

[`AnvilSetNextBlockBaseFeePerGasProcedure`](../type-aliases/AnvilSetNextBlockBaseFeePerGasProcedure.md)

## Example

```typescript
import { createTevmNode } from '@tevm/node'
import { anvilSetNextBlockBaseFeePerGasJsonRpcProcedure } from '@tevm/actions'

const client = createTevmNode()
const procedure = anvilSetNextBlockBaseFeePerGasJsonRpcProcedure(client)

const result = await procedure({
  jsonrpc: '2.0',
  method: 'anvil_setNextBlockBaseFeePerGas',
  params: ['0x3B9ACA00'], // 1 gwei in hex
  id: 1,
})
// result: { jsonrpc: '2.0', method: 'anvil_setNextBlockBaseFeePerGas', result: null, id: 1 }

// Only the next block will have this base fee
await client.tevmMine()
const block = await client.getVm().then(vm => vm.blockchain.getCanonicalHeadBlock())
console.log(block.header.baseFeePerGas) // 1000000000n (1 gwei)

// Subsequent blocks will calculate base fee automatically
await client.tevmMine()
const block2 = await client.getVm().then(vm => vm.blockchain.getCanonicalHeadBlock())
console.log(block2.header.baseFeePerGas) // Calculated from previous block
```
