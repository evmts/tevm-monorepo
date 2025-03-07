[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / dreyerxMainnet

# Variable: dreyerxMainnet

> `const` **dreyerxMainnet**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/dreyerxMainnet.d.ts:21

Creates a common configuration for the dreyerxMainnet chain.

## Description

Chain ID: 23451
Chain Name: DreyerX Mainnet
Default Block Explorer: https://scan.dreyerx.com
Default RPC URL: https://rpc.dreyerx.com

## Example

```ts
import { createMemoryClient } from 'tevm'
import { dreyerxMainnet } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: dreyerxMainnet,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
