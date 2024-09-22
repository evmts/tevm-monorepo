[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [common](../README.md) / degen

# Variable: degen

> `const` **degen**: `Common`

Creates a common configuration for the degen chain.

## Description

Chain ID: 666666666
Chain Name: Degen
Default Block Explorer: https://explorer.degen.tips
Default RPC URL: https://rpc.degen.tips

## Example

```ts
import { createMemoryClient } from 'tevm'
import { degen } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: degen,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```

## Defined in

packages/common/types/presets/degen.d.ts:21
