[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [common](../README.md) / jbcTestnet

# Variable: jbcTestnet

> `const` **jbcTestnet**: `Common`

Creates a common configuration for the jbcTestnet chain.

## Description

Chain ID: 88991
Chain Name: Jibchain Testnet
Default Block Explorer: https://exp.testnet.jibchain.net
Default RPC URL: https://rpc.testnet.jibchain.net

## Example

```ts
import { createMemoryClient } from 'tevm'
import { jbcTestnet } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: jbcTestnet,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```

## Defined in

packages/common/types/presets/jbcTestnet.d.ts:21
