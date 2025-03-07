[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / cyberTestnet

# Variable: cyberTestnet

> `const` **cyberTestnet**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/cyberTestnet.d.ts:21

Creates a common configuration for the cyberTestnet chain.

## Description

Chain ID: 111557560
Chain Name: Cyber Testnet
Default Block Explorer: https://testnet.cyberscan.co
Default RPC URL: https://cyber-testnet.alt.technology

## Example

```ts
import { createMemoryClient } from 'tevm'
import { cyberTestnet } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: cyberTestnet,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
