[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / real

# Variable: real

> `const` **real**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/real.d.ts:21

Creates a common configuration for the real chain.

## Description

Chain ID: 111188
Chain Name: re.al
Default Block Explorer: https://explorer.re.al
Default RPC URL: https://real.drpc.org

## Example

```ts
import { createMemoryClient } from 'tevm'
import { real } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: real,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
