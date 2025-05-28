[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [state](../README.md) / ForkOptions

# Interface: ForkOptions

Defined in: packages/state/dist/index.d.ts:50

Configuration options for forking from an existing blockchain network.
Used to specify the RPC endpoint and block number to fork from.

## Example

```typescript
import { ForkOptions } from '@tevm/state'
import { http } from 'viem'

const value: ForkOptions = {
  transport: http('https://mainnet.infura.io/v3/your-api-key'),
  blockTag: 'latest'
}
```

## Properties

### blockTag?

> `optional` **blockTag**: `bigint` \| [`BlockTag`](../../index/type-aliases/BlockTag.md)

Defined in: packages/state/dist/index.d.ts:54

***

### transport

> **transport**: `Transport` \| \{ `request`: `EIP1193RequestFn`; \}

Defined in: packages/state/dist/index.d.ts:51
