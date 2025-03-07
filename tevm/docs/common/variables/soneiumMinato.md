[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / soneiumMinato

# Variable: soneiumMinato

> `const` **soneiumMinato**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/soneiumMinato.d.ts:21

Creates a common configuration for the soneiumMinato chain.

## Description

Chain ID: 1946
Chain Name: Soneium Minato
Default Block Explorer: https://explorer-testnet.soneium.org
Default RPC URL: https://rpc.minato.soneium.org

## Example

```ts
import { createMemoryClient } from 'tevm'
import { soneiumMinato } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: soneiumMinato,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
