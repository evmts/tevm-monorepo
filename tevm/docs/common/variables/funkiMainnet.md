[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / funkiMainnet

# Variable: funkiMainnet

> `const` **funkiMainnet**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/funkiMainnet.d.ts:21

Creates a common configuration for the funkiMainnet chain.

## Description

Chain ID: 33979
Chain Name: Funki
Default Block Explorer: https://funkiscan.io
Default RPC URL: https://rpc-mainnet.funkichain.com

## Example

```ts
import { createMemoryClient } from 'tevm'
import { funkiMainnet } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: funkiMainnet,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
