[**@tevm/memory-client**](../README.md)

***

[@tevm/memory-client](../globals.md) / createTevmTransport

# Function: createTevmTransport()

> **createTevmTransport**(`options`): [`TevmTransport`](../type-aliases/TevmTransport.md)\<`string`\>

Defined in: [packages/memory-client/src/createTevmTransport.js:100](https://github.com/evmts/tevm-monorepo/blob/main/packages/memory-client/src/createTevmTransport.js#L100)

Creates a custom TEVM Transport for viem clients, integrating an in-memory Ethereum Virtual Machine.

A Transport in viem is the intermediary layer responsible for executing outgoing JSON-RPC requests.
The TEVM Transport implementation replaces network requests with direct calls to an in-memory EVM,
providing several key advantages:

- **Local-first operation**: All EVM execution happens directly in the JavaScript runtime
- **Zero network latency**: No round-trips to remote nodes for operations
- **Deterministic execution**: Full control over the execution environment for testing
- **Advanced tracing**: Step-by-step EVM execution with introspection capabilities
- **Forking capabilities**: Can lazily load state from remote networks as needed
- **Customizable state**: Direct manipulation of accounts, balances, storage, and more

The transport can be used with any viem client (wallet, public, or test) and fully supports the
EIP-1193 provider interface, making it compatible with the broader Ethereum ecosystem.

## Parameters

### options

`TevmNodeOptions`\<\{ `blockExplorers?`: \{[`key`: `string`]: `ChainBlockExplorer`; `default`: `ChainBlockExplorer`; \}; `contracts?`: \{[`key`: `string`]: `undefined` \| `ChainContract` \| \{[`sourceId`: `number`]: `undefined` \| `ChainContract`; \}; `ensRegistry?`: `ChainContract`; `ensUniversalResolver?`: `ChainContract`; `multicall3?`: `ChainContract`; `universalSignatureVerifier?`: `ChainContract`; \}; `copy`: () => `object`; `custom?`: `Record`\<`string`, `unknown`\>; `ensTlds?`: readonly `string`[]; `ethjsCommon`: `Common`; `fees?`: `ChainFees`\<`undefined` \| `ChainFormatters`\>; `formatters?`: `ChainFormatters`; `id`: `number`; `name`: `string`; `nativeCurrency`: `ChainNativeCurrency`; `rpcUrls`: \{[`key`: `string`]: `ChainRpcUrls`; `default`: `ChainRpcUrls`; \}; `serializers?`: `ChainSerializers`\<`undefined` \| `ChainFormatters`, `TransactionSerializable`\>; `sourceId?`: `number`; `testnet?`: `boolean`; \}\> = `{}`

Configuration options for the underlying TEVM node.

## Returns

[`TevmTransport`](../type-aliases/TevmTransport.md)\<`string`\>

A configured TEVM transport factory function.

## Example

```typescript
import { createClient, http } from 'viem'
import { createTevmTransport } from 'tevm'
import { optimism } from 'tevm/common'

// Create a client with TEVM transport that forks from Optimism mainnet
const client = createClient({
  transport: createTevmTransport({
    fork: {
      transport: http('https://mainnet.optimism.io')({}),
      blockTag: 'latest' // Optional: specify block number or hash
    },
    mining: {
      auto: true,        // Optional: enable auto-mining after transactions
      interval: 0        // Optional: mine blocks at regular intervals (ms)
    }
  }),
  chain: optimism,
})

async function example() {
  // Ready check ensures fork is initialized
  await client.transport.tevm.ready()

  const blockNumber = await client.getBlockNumber()
  console.log(`Connected to block ${blockNumber}`)

  // Access the underlying TEVM node for advanced operations
  const node = client.transport.tevm
  const vm = await node.getVm()
  console.log(`EVM hardfork: ${vm.common.hardfork()}`)
}

example()
```

## See

 - [createClient](createClient.md) - Viem function for creating clients
 - [Viem Client Docs](https://viem.sh/docs/clients/introduction)
 - [Client Guide](https://tevm.sh/learn/clients/)
 - [tevm JSON-RPC Guide](https://tevm.sh/learn/json-rpc/)
 - [EIP-1193 spec](https://eips.ethereum.org/EIPS/eip-1193)
 - [Ethereum JSON-RPC docs](https://ethereum.org/en/developers/docs/apis/json-rpc/)
 - [CreateMemoryClient Docs](https://tevm.sh/reference/tevm/memory-client/functions/creatememoryclient/) - For a batteries-included client if not worried about tree shaking
