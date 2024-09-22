[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [common](../README.md) / fuseSparknet

# Variable: fuseSparknet

> `const` **fuseSparknet**: `Common`

Creates a common configuration for the fuseSparknet chain.

## Description

Chain ID: 123
Chain Name: Fuse Sparknet
Default Block Explorer: https://explorer.fusespark.io
Default RPC URL: https://rpc.fusespark.io

## Example

```ts
import { createMemoryClient } from 'tevm'
import { fuseSparknet } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: fuseSparknet,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```

## Defined in

packages/common/types/presets/fuseSparknet.d.ts:21
