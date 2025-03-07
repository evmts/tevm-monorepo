[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / zkLinkNova

# Variable: zkLinkNova

> `const` **zkLinkNova**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/zkLinkNova.d.ts:21

Creates a common configuration for the zkLinkNova chain.

## Description

Chain ID: 810180
Chain Name: zkLink Nova
Default Block Explorer: https://explorer.zklink.io
Default RPC URL: https://rpc.zklink.io

## Example

```ts
import { createMemoryClient } from 'tevm'
import { zkLinkNova } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: zkLinkNova,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
