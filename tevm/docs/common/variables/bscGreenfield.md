[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [common](../README.md) / bscGreenfield

# Variable: bscGreenfield

> `const` **bscGreenfield**: `Common`

Creates a common configuration for the bscGreenfield chain.

## Description

Chain ID: 1017
Chain Name: BNB Greenfield Chain
Default Block Explorer: https://greenfieldscan.com
Default RPC URL: https://greenfield-chain.bnbchain.org

## Example

```ts
import { createMemoryClient } from 'tevm'
import { bscGreenfield } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: bscGreenfield,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```

## Defined in

packages/common/types/presets/bscGreenfield.d.ts:21
