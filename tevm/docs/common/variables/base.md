[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [common](../README.md) / base

# Variable: base

> `const` **base**: `Common`

Creates a common configuration for the base chain.

## Description

Chain ID: 8453
Chain Name: Base
Default Block Explorer: https://basescan.org
Default RPC URL: https://mainnet.base.org

## Example

```ts
import { createMemoryClient } from 'tevm'
import { base } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: base,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```

## Defined in

packages/common/types/presets/base.d.ts:21
