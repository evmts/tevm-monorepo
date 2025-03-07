[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / bevmMainnet

# Variable: bevmMainnet

> `const` **bevmMainnet**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/bevmMainnet.d.ts:21

Creates a common configuration for the bevmMainnet chain.

## Description

Chain ID: 11501
Chain Name: BEVM Mainnet
Default Block Explorer: https://scan-mainnet.bevm.io
Default RPC URL: https://rpc-mainnet-1.bevm.io

## Example

```ts
import { createMemoryClient } from 'tevm'
import { bevmMainnet } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: bevmMainnet,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
