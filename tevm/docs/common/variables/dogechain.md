[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [common](../README.md) / dogechain

# Variable: dogechain

> `const` **dogechain**: `Common`

Creates a common configuration for the dogechain chain.

## Description

Chain ID: 2000
Chain Name: Dogechain
Default Block Explorer: https://explorer.dogechain.dog
Default RPC URL: https://rpc.dogechain.dog

## Example

```ts
import { createMemoryClient } from 'tevm'
import { dogechain } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: dogechain,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```

## Defined in

packages/common/types/presets/dogechain.d.ts:21
