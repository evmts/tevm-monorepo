[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [state](../README.md) / ForkOptions

# Interface: ForkOptions

Configuration options for forking from an existing blockchain network.
Used to specify the RPC endpoint and block number to fork from.

## Examples

```typescript
import { ForkOptions } from '@tevm/state'
import { http } from 'viem'

const value: ForkOptions = {
  transport: http('https://mainnet.infura.io/v3/your-api-key'),
  blockTag: 'latest'
}
```

```typescript
// Override chain ID to avoid wallet confusion when forking
import { ForkOptions } from '@tevm/state'
import { http } from 'viem'

const value: ForkOptions = {
  transport: http('https://mainnet.optimism.io'),
  chainId: 1337, // Use a custom chain ID instead of Optimism's 10
}
```

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| <a id="blockhash"></a> `blockHash?` | `` `0x${string}` `` | - |
| <a id="blocktag"></a> `blockTag?` | `bigint` \| [`BlockTag`](../../index/type-aliases/BlockTag.md) | - |
| <a id="chainid"></a> `chainId?` | `number` | Optional chain ID override. When set, this chain ID will be used instead of the one fetched from the fork RPC. This is useful to avoid wallet confusion (e.g., MetaMask) when the same chain ID is used for both the fork and the original network. **Example** `const client = createMemoryClient({ fork: { transport: http('https://mainnet.optimism.io'), chainId: 1337, // Override Optimism's chain ID (10) with a custom one }, })` |
| <a id="transport"></a> `transport` | `Transport` \| \{ `request`: `EIP1193RequestFn`\<`any`\>; \} | - |
