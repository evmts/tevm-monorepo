[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [common](../README.md) / chiliz

# Variable: chiliz

> `const` **chiliz**: `Common`

Creates a common configuration for the chiliz chain.

## Description

Chain ID: 88888
Chain Name: Chiliz Chain
Default Block Explorer: https://scan.chiliz.com
Default RPC URL: https://rpc.ankr.com/chiliz

## Example

```ts
import { createMemoryClient } from 'tevm'
import { chiliz } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: chiliz,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```

## Defined in

packages/common/types/presets/chiliz.d.ts:21
