[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / zetachain

# Variable: zetachain

> `const` **zetachain**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/zetachain.d.ts:21

Creates a common configuration for the zetachain chain.

## Description

Chain ID: 7000
Chain Name: ZetaChain
Default Block Explorer: https://explorer.zetachain.com
Default RPC URL: https://zetachain-evm.blockpi.network/v1/rpc/public

## Example

```ts
import { createMemoryClient } from 'tevm'
import { zetachain } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: zetachain,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
