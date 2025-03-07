[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / wemix

# Variable: wemix

> `const` **wemix**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/wemix.d.ts:21

Creates a common configuration for the wemix chain.

## Description

Chain ID: 1111
Chain Name: WEMIX
Default Block Explorer: https://explorer.wemix.com
Default RPC URL: https://api.wemix.com

## Example

```ts
import { createMemoryClient } from 'tevm'
import { wemix } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: wemix,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
