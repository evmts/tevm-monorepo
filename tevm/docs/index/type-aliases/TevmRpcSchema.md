[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / TevmRpcSchema

# Type Alias: TevmRpcSchema

> **TevmRpcSchema** = \[`...PublicRpcSchema`, ...TestRpcSchema\<"anvil" \| "ganache" \| "hardhat"\>, [`JsonRpcSchemaTevm`](../../decorators/type-aliases/JsonRpcSchemaTevm.md)\[`"tevm_call"`\], [`JsonRpcSchemaTevm`](../../decorators/type-aliases/JsonRpcSchemaTevm.md)\[`"tevm_dumpState"`\], [`JsonRpcSchemaTevm`](../../decorators/type-aliases/JsonRpcSchemaTevm.md)\[`"tevm_loadState"`\], [`JsonRpcSchemaTevm`](../../decorators/type-aliases/JsonRpcSchemaTevm.md)\[`"tevm_getAccount"`\], [`JsonRpcSchemaTevm`](../../decorators/type-aliases/JsonRpcSchemaTevm.md)\[`"tevm_setAccount"`\]\]

Defined in: packages/memory-client/types/TevmRpcSchema.d.ts:35

The JSON-RPC schema for TEVM.
This type represents the JSON-RPC requests that the EIP-1193 client can handle when using TEVM.
It includes public, test, and TEVM-specific methods.

## Example

```typescript
import { createClient, http } from 'viem'
import { optimism } from 'tevm/common'
import { createTevmTransport } from 'tevm'

const client = createClient({
  transport: createTevmTransport({
    fork: { transport: http('https://mainnet.optimism.io')({}) }
  }),
  chain: optimism,
})

async function example() {
  const result = await client.request({
    method: 'tevm_call',
    params: [{ to: '0x123...', data: '0x123...' }],
  })
  console.log(result)
}

example()
```

## See

 - [Tevm JSON-RPC guide](https://tevm.sh/learn/json-rpc/)
 - [EIP-1193](https://eips.ethereum.org/EIPS/eip-1193)
 - [Ethereum jsonrpc](https://ethereum.org/en/developers/docs/apis/json-rpc/)
