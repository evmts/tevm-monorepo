[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [common](../README.md) / optimismGoerli

# Variable: optimismGoerli

> `const` **optimismGoerli**: `Common`

Creates a common configuration for the optimismGoerli chain.

## Description

Chain ID: 420
Chain Name: Optimism Goerli
Default Block Explorer: https://goerli-optimism.etherscan.io
Default RPC URL: https://goerli.optimism.io

## Example

```ts
import { createMemoryClient } from 'tevm'
import { optimismGoerli } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: optimismGoerli,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```

## Defined in

packages/common/types/presets/optimismGoerli.d.ts:21
