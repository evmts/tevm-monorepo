[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [common](../README.md) / merlin

# Variable: merlin

> `const` **merlin**: `Common`

Creates a common configuration for the merlin chain.

## Description

Chain ID: 4200
Chain Name: Merlin
Default Block Explorer: https://scan.merlinchain.io
Default RPC URL: https://rpc.merlinchain.io

## Example

```ts
import { createMemoryClient } from 'tevm'
import { merlin } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: merlin,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```

## Defined in

packages/common/types/presets/merlin.d.ts:21
