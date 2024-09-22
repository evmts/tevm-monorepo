[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [common](../README.md) / shibariumTestnet

# Variable: shibariumTestnet

> `const` **shibariumTestnet**: `Common`

Creates a common configuration for the shibariumTestnet chain.

## Description

Chain ID: 157
Chain Name: Puppynet Shibarium
Default Block Explorer: https://puppyscan.shib.io
Default RPC URL: https://puppynet.shibrpc.com

## Example

```ts
import { createMemoryClient } from 'tevm'
import { shibariumTestnet } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: shibariumTestnet,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```

## Defined in

packages/common/types/presets/shibariumTestnet.d.ts:21
