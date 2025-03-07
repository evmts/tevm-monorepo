[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / saigon

# Variable: saigon

> `const` **saigon**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/saigon.d.ts:21

Creates a common configuration for the saigon chain.

## Description

Chain ID: 2021
Chain Name: Saigon Testnet
Default Block Explorer: https://saigon-app.roninchain.com
Default RPC URL: https://saigon-testnet.roninchain.com/rpc

## Example

```ts
import { createMemoryClient } from 'tevm'
import { saigon } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: saigon,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
