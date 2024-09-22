[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [common](../README.md) / blast

# Variable: blast

> `const` **blast**: `Common`

Creates a common configuration for the blast chain.

## Description

Chain ID: 81457
Chain Name: Blast
Default Block Explorer: https://blastscan.io
Default RPC URL: https://rpc.blast.io

## Example

```ts
import { createMemoryClient } from 'tevm'
import { blast } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: blast,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```

## Defined in

packages/common/types/presets/blast.d.ts:21
