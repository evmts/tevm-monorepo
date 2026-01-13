[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [state](../README.md) / ForkOptions

# Interface: ForkOptions

Defined in: packages/state/dist/index.d.ts:61

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

### blockTag?

> `optional` **blockTag**: `bigint` \| [`BlockTag`](../../index/type-aliases/BlockTag.md)

Defined in: packages/state/dist/index.d.ts:65

***

### chainId?

> `optional` **chainId**: `number`

Defined in: packages/state/dist/index.d.ts:81

Optional chain ID override.
When set, this chain ID will be used instead of the one fetched from the fork RPC.
This is useful to avoid wallet confusion (e.g., MetaMask) when the same chain ID
is used for both the fork and the original network.

#### Example

```typescript
const client = createMemoryClient({
  fork: {
    transport: http('https://mainnet.optimism.io'),
    chainId: 1337, // Override Optimism's chain ID (10) with a custom one
  },
})
```

***

### transport

> **transport**: `Transport` \| \{ `request`: `EIP1193RequestFn`; \}

Defined in: packages/state/dist/index.d.ts:62
