[**@tevm/memory-client**](../README.md)

***

[@tevm/memory-client](../globals.md) / createTevmTransport

# Function: createTevmTransport()

> **createTevmTransport**(`options?`): [`TevmTransport`](../type-aliases/TevmTransport.md)\<`string`\>

Defined in: [packages/memory-client/src/createTevmTransport.js:34](https://github.com/evmts/tevm-monorepo/blob/main/packages/memory-client/src/createTevmTransport.js#L34)

Creates a custom TEVM Transport for viem clients, backed by an in-memory EVM.

Replaces JSON-RPC network calls with direct in-memory EVM execution while remaining
EIP-1193 compatible. Internally caches a TEVM node per chain ID so clients on the same
chain share state. For a batteries-included client, use [createMemoryClient](../variables/createMemoryClient.md).

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `options` | `TevmNodeOptions`\<\{ `blockExplorers?`: \{\[`key`: `string`\]: `ChainBlockExplorer`; `default`: `ChainBlockExplorer`; \}; `blockTime?`: `number`; `contracts?`: \{\[`key`: `string`\]: `ChainContract` \| \{\[`sourceId`: `number`\]: `ChainContract` \| `undefined`; \} \| `undefined`; `ensRegistry?`: `ChainContract`; `ensUniversalResolver?`: `ChainContract`; `erc6492Verifier?`: `ChainContract`; `multicall3?`: `ChainContract`; \}; `copy`: () => `object`; `custom?`: `Record`\<`string`, `unknown`\>; `ensTlds?`: readonly `string`[]; `ethjsCommon`: `Common`; `experimental_preconfirmationTime?`: `number`; `extendSchema?`: `Record`\<`string`, `unknown`\>; `fees?`: `ChainFees`\<`ChainFormatters` \| `undefined`\>; `formatters?`: `ChainFormatters`; `id`: `number`; `name`: `string`; `nativeCurrency`: `ChainNativeCurrency`; `prepareTransactionRequest?`: `PrepareTransactionRequestFn` \| \[`PrepareTransactionRequestFn`, `object`\]; `rpcUrls`: \{\[`key`: `string`\]: `ChainRpcUrls`; `default`: `ChainRpcUrls`; \}; `serializers?`: `ChainSerializers`\<`ChainFormatters` \| `undefined`, `TransactionSerializable`\>; `sourceId?`: `number`; `testnet?`: `boolean`; `verifyHash?`: `ChainVerifyHashFn`; \}\> | Configuration options for the underlying TEVM node. |

## Returns

[`TevmTransport`](../type-aliases/TevmTransport.md)\<`string`\>

A configured TEVM transport factory function.

## Example

```typescript
import { createClient, http } from 'viem'
import { createTevmTransport } from 'tevm'
import { optimism } from 'tevm/common'

const client = createClient({
  transport: createTevmTransport({
    fork: { transport: http('https://mainnet.optimism.io')({}) },
  }),
  chain: optimism,
})
await client.transport.tevm.ready()
```

## See

 - [Client Guide](https://tevm.sh/learn/clients/)
 - [EIP-1193 spec](https://eips.ethereum.org/EIPS/eip-1193)
