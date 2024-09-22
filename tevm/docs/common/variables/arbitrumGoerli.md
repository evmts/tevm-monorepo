[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [common](../README.md) / arbitrumGoerli

# Variable: arbitrumGoerli

> `const` **arbitrumGoerli**: `Common`

Creates a common configuration for the arbitrumGoerli chain.

## Description

Chain ID: 421613
Chain Name: Arbitrum Goerli
Default Block Explorer: https://goerli.arbiscan.io
Default RPC URL: https://goerli-rollup.arbitrum.io/rpc

## Example

```ts
import { createMemoryClient } from 'tevm'
import { arbitrumGoerli } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: arbitrumGoerli,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```

## Defined in

packages/common/types/presets/arbitrumGoerli.d.ts:21
