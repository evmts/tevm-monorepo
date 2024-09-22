[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [common](../README.md) / plinga

# Variable: plinga

> `const` **plinga**: `Common`

Creates a common configuration for the plinga chain.

## Description

Chain ID: 242
Chain Name: Plinga
Default Block Explorer: https://www.plgscan.com
Default RPC URL: https://rpcurl.mainnet.plgchain.com

## Example

```ts
import { createMemoryClient } from 'tevm'
import { plinga } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: plinga,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```

## Defined in

packages/common/types/presets/plinga.d.ts:21
