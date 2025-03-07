[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / optimismGoerli

# Variable: optimismGoerli

> `const` **optimismGoerli**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/optimismGoerli.d.ts:21

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
