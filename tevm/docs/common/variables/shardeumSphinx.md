[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [common](../README.md) / shardeumSphinx

# Variable: shardeumSphinx

> `const` **shardeumSphinx**: `Common`

Creates a common configuration for the shardeumSphinx chain.

## Description

Chain ID: 8082
Chain Name: Shardeum Sphinx
Default Block Explorer: https://explorer-sphinx.shardeum.org
Default RPC URL: https://sphinx.shardeum.org

## Example

```ts
import { createMemoryClient } from 'tevm'
import { shardeumSphinx } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: shardeumSphinx,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```

## Defined in

packages/common/types/presets/shardeumSphinx.d.ts:21
