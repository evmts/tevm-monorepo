[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / metachain

# Variable: metachain

> `const` **metachain**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/metachain.d.ts:21

Creates a common configuration for the metachain chain.

## Description

Chain ID: 571
Chain Name: MetaChain Mainnet
Default Block Explorer: https://explorer.metatime.com
Default RPC URL: https://rpc.metatime.com

## Example

```ts
import { createMemoryClient } from 'tevm'
import { metachain } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: metachain,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
