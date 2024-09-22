[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [common](../README.md) / fluenceStage

# Variable: fluenceStage

> `const` **fluenceStage**: `Common`

Creates a common configuration for the fluenceStage chain.

## Description

Chain ID: 123420000220
Chain Name: Fluence Stage
Default Block Explorer: https://blockscout.stage.fluence.dev
Default RPC URL: https://rpc.stage.fluence.dev

## Example

```ts
import { createMemoryClient } from 'tevm'
import { fluenceStage } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: fluenceStage,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```

## Defined in

packages/common/types/presets/fluenceStage.d.ts:21
