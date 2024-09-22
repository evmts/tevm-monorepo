[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [common](../README.md) / kcc

# Variable: kcc

> `const` **kcc**: `Common`

Creates a common configuration for the kcc chain.

## Description

Chain ID: 321
Chain Name: KCC Mainnet
Default Block Explorer: https://explorer.kcc.io
Default RPC URL: https://kcc-rpc.com

## Example

```ts
import { createMemoryClient } from 'tevm'
import { kcc } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: kcc,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```

## Defined in

packages/common/types/presets/kcc.d.ts:21
