[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / flowMainnet

# Variable: flowMainnet

> `const` **flowMainnet**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/flowMainnet.d.ts:21

Creates a common configuration for the flowMainnet chain.

## Description

Chain ID: 747
Chain Name: FlowEVM Mainnet
Default Block Explorer: https://flowdiver.io
Default RPC URL: https://mainnet.evm.nodes.onflow.org

## Example

```ts
import { createMemoryClient } from 'tevm'
import { flowMainnet } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: flowMainnet,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
