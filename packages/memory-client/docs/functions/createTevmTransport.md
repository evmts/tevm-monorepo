[**@tevm/memory-client**](../README.md) • **Docs**

***

[@tevm/memory-client](../globals.md) / createTevmTransport

# Function: createTevmTransport()

> **createTevmTransport**(`options`): [`TevmTransport`](../type-aliases/TevmTransport.md)\<`string`\>

Creates a custom TEVM Transport for viem.

A Transport in viem is the intermediary layer responsible for executing outgoing RPC requests. This custom TEVM Transport integrates an in-memory Ethereum client, making it ideal for local-first applications, optimistic updates, and advanced TEVM functionalities like scripting.

## Parameters

• **options**: `TevmNodeOptions`\<`object`\> = `{}`

Configuration options for the base client, similar to those used in `memoryClient` or a low-level `baseClient`.

## Returns

[`TevmTransport`](../type-aliases/TevmTransport.md)\<`string`\>

A configured TEVM transport.

## Example

```typescript
import { createClient, http } from 'viem'
import { createTevmTransport } from 'tevm'
import { optimism } from 'tevm/common'

const client = createClient({
  transport: createTevmTransport({
    fork: { transport: http('https://mainnet.optimism.io')({}) }
  }),
  chain: optimism,
})

async function example() {
  const blockNumber = await client.getBlockNumber()
  console.log(blockNumber)
}

example()
```

## See

 - [createClient](createClient.md)
 - [Viem Client Docs](https://viem.sh/docs/clients/introduction)
 - [Client Guide](https://tevm.sh/learn/clients/)
 - [tevm JSON-RPC Guide](https://tevm.sh/learn/json-rpc/)
 - [EIP-1193 spec](https://eips.ethereum.org/EIPS/eip-1193)
 - [Ethereum jsonrpc docs](https://ethereum.org/en/developers/docs/apis/json-rpc/)
 - [CreateMemoryClient Docs](https://tevm.sh/reference/tevm/memory-client/functions/creatememoryclient/) - For a batteries-included client if not worried about tree shaking

## Defined in

[packages/memory-client/src/createTevmTransport.js:58](https://github.com/evmts/tevm-monorepo/blob/main/packages/memory-client/src/createTevmTransport.js#L58)
