[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [common](../README.md) / filecoinCalibration

# Variable: filecoinCalibration

> `const` **filecoinCalibration**: `Common`

Creates a common configuration for the filecoinCalibration chain.

## Description

Chain ID: 314159
Chain Name: Filecoin Calibration
Default Block Explorer: https://calibration.filscan.io
Default RPC URL: https://api.calibration.node.glif.io/rpc/v1

## Example

```ts
import { createMemoryClient } from 'tevm'
import { filecoinCalibration } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: filecoinCalibration,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```

## Defined in

packages/common/types/presets/filecoinCalibration.d.ts:21
