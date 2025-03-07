[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / storyTestnet

# Variable: storyTestnet

> `const` **storyTestnet**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/storyTestnet.d.ts:21

Creates a common configuration for the storyTestnet chain.

## Description

Chain ID: 1513
Chain Name: Story Testnet
Default Block Explorer: https://testnet.storyscan.xyz
Default RPC URL: https://testnet.storyrpc.io

## Example

```ts
import { createMemoryClient } from 'tevm'
import { storyTestnet } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: storyTestnet,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
