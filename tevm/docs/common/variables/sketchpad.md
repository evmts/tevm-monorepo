[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / sketchpad

# Variable: sketchpad

> `const` **sketchpad**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/sketchpad.d.ts:21

Creates a common configuration for the sketchpad chain.

## Description

Chain ID: 984123
Chain Name: Forma Sketchpad
Default Block Explorer: https://explorer.sketchpad-1.forma.art
Default RPC URL: https://rpc.sketchpad-1.forma.art

## Example

```ts
import { createMemoryClient } from 'tevm'
import { sketchpad } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: sketchpad,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
