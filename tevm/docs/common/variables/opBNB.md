[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / opBNB

# Variable: opBNB

> `const` **opBNB**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/opBNB.d.ts:21

Creates a common configuration for the opBNB chain.

## Description

Chain ID: 204
Chain Name: opBNB
Default Block Explorer: https://mainnet.opbnbscan.com
Default RPC URL: https://opbnb-mainnet-rpc.bnbchain.org

## Example

```ts
import { createMemoryClient } from 'tevm'
import { opBNB } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: opBNB,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
