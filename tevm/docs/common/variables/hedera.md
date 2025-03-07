[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / hedera

# Variable: hedera

> `const` **hedera**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/hedera.d.ts:21

Creates a common configuration for the hedera chain.

## Description

Chain ID: 295
Chain Name: Hedera Mainnet
Default Block Explorer: https://hashscan.io/mainnet
Default RPC URL: https://mainnet.hashio.io/api

## Example

```ts
import { createMemoryClient } from 'tevm'
import { hedera } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: hedera,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
