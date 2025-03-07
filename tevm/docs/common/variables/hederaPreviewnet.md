[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / hederaPreviewnet

# Variable: hederaPreviewnet

> `const` **hederaPreviewnet**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/hederaPreviewnet.d.ts:21

Creates a common configuration for the hederaPreviewnet chain.

## Description

Chain ID: 297
Chain Name: Hedera Previewnet
Default Block Explorer: https://hashscan.io/previewnet
Default RPC URL: https://previewnet.hashio.io/api

## Example

```ts
import { createMemoryClient } from 'tevm'
import { hederaPreviewnet } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: hederaPreviewnet,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
