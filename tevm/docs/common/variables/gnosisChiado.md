[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [common](../README.md) / gnosisChiado

# Variable: gnosisChiado

> `const` **gnosisChiado**: `Common`

Creates a common configuration for the gnosisChiado chain.

## Description

Chain ID: 10200
Chain Name: Gnosis Chiado
Default Block Explorer: https://blockscout.chiadochain.net
Default RPC URL: https://rpc.chiadochain.net

## Example

```ts
import { createMemoryClient } from 'tevm'
import { gnosisChiado } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: gnosisChiado,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```

## Defined in

packages/common/types/presets/gnosisChiado.d.ts:21
