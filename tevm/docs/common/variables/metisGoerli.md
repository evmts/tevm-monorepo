[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / metisGoerli

# Variable: metisGoerli

> `const` **metisGoerli**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/metisGoerli.d.ts:21

Creates a common configuration for the metisGoerli chain.

## Description

Chain ID: 599
Chain Name: Metis Goerli
Default Block Explorer: https://goerli.explorer.metisdevops.link
Default RPC URL: https://goerli.gateway.metisdevops.link

## Example

```ts
import { createMemoryClient } from 'tevm'
import { metisGoerli } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: metisGoerli,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
