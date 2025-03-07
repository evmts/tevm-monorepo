[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / otimDevnet

# Variable: otimDevnet

> `const` **otimDevnet**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/otimDevnet.d.ts:21

Creates a common configuration for the otimDevnet chain.

## Description

Chain ID: 41144114
Chain Name: Otim Devnet
Default Block Explorer: Not specified
Default RPC URL: http://devnet.otim.xyz

## Example

```ts
import { createMemoryClient } from 'tevm'
import { otimDevnet } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: otimDevnet,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
