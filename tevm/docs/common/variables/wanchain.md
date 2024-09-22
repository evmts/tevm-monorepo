[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [common](../README.md) / wanchain

# Variable: wanchain

> `const` **wanchain**: `Common`

Creates a common configuration for the wanchain chain.

## Description

Chain ID: 888
Chain Name: Wanchain
Default Block Explorer: https://wanscan.org
Default RPC URL: https://gwan-ssl.wandevs.org:56891

## Example

```ts
import { createMemoryClient } from 'tevm'
import { wanchain } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: wanchain,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```

## Defined in

packages/common/types/presets/wanchain.d.ts:21
