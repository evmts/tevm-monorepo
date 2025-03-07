[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / flareTestnet

# Variable: flareTestnet

> `const` **flareTestnet**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/flareTestnet.d.ts:21

Creates a common configuration for the flareTestnet chain.

## Description

Chain ID: 114
Chain Name: Coston2
Default Block Explorer: https://coston2-explorer.flare.network
Default RPC URL: https://coston2-api.flare.network/ext/C/rpc

## Example

```ts
import { createMemoryClient } from 'tevm'
import { flareTestnet } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: flareTestnet,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
