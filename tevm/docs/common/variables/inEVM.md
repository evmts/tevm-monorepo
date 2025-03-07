[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / inEVM

# Variable: inEVM

> `const` **inEVM**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/inEVM.d.ts:21

Creates a common configuration for the inEVM chain.

## Description

Chain ID: 2525
Chain Name: inEVM Mainnet
Default Block Explorer: https://inevm.calderaexplorer.xyz
Default RPC URL: https://mainnet.rpc.inevm.com/http

## Example

```ts
import { createMemoryClient } from 'tevm'
import { inEVM } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: inEVM,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
