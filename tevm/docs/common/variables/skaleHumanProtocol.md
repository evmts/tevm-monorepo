[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / skaleHumanProtocol

# Variable: skaleHumanProtocol

> `const` **skaleHumanProtocol**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/skaleHumanProtocol.d.ts:21

Creates a common configuration for the skaleHumanProtocol chain.

## Description

Chain ID: 1273227453
Chain Name: SKALE | Human Protocol
Default Block Explorer: https://wan-red-ain.explorer.mainnet.skalenodes.com
Default RPC URL: https://mainnet.skalenodes.com/v1/wan-red-ain

## Example

```ts
import { createMemoryClient } from 'tevm'
import { skaleHumanProtocol } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: skaleHumanProtocol,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
