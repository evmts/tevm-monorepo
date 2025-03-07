[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / flowPreviewnet

# Variable: flowPreviewnet

> `const` **flowPreviewnet**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/flowPreviewnet.d.ts:21

Creates a common configuration for the flowPreviewnet chain.

## Description

Chain ID: 646
Chain Name: FlowEVM Previewnet
Default Block Explorer: https://previewnet.flowdiver.io
Default RPC URL: https://previewnet.evm.nodes.onflow.org

## Example

```ts
import { createMemoryClient } from 'tevm'
import { flowPreviewnet } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: flowPreviewnet,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
