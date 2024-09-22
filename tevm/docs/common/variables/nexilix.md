[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [common](../README.md) / nexilix

# Variable: nexilix

> `const` **nexilix**: `Common`

Creates a common configuration for the nexilix chain.

## Description

Chain ID: 240
Chain Name: Nexilix Smart Chain
Default Block Explorer: https://scan.nexilix.com
Default RPC URL: https://rpcurl.pos.nexilix.com

## Example

```ts
import { createMemoryClient } from 'tevm'
import { nexilix } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: nexilix,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```

## Defined in

packages/common/types/presets/nexilix.d.ts:21
