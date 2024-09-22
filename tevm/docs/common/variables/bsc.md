[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [common](../README.md) / bsc

# Variable: bsc

> `const` **bsc**: `Common`

Creates a common configuration for the bsc chain.

## Description

Chain ID: 56
Chain Name: BNB Smart Chain
Default Block Explorer: https://bscscan.com
Default RPC URL: https://rpc.ankr.com/bsc

## Example

```ts
import { createMemoryClient } from 'tevm'
import { bsc } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: bsc,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```

## Defined in

packages/common/types/presets/bsc.d.ts:21
