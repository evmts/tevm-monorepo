[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / TevmViemActionsApi

# Type Alias: TevmViemActionsApi

> **TevmViemActionsApi**: `object`

Defined in: packages/memory-client/types/TevmViemActionsApi.d.ts:15

A custom [viem extension](https://viem.sh/docs/clients/custom#extending-with-actions-or-configuration) for adding powerful
Tevm specific actions to the client. These actions come preloaded with [MemoryClient](https://tevm.sh/reference/tevm/memory-client/type-aliases/memoryclient/)
To add these actions use the `extend` method on a TevmClient with the tevmViemActions() extension.

## Type declaration

### tevmCall

> **tevmCall**: [`TevmActionsApi`](TevmActionsApi.md)\[`"call"`\]

### tevmContract

> **tevmContract**: [`TevmActionsApi`](TevmActionsApi.md)\[`"contract"`\]

### tevmDeal

> **tevmDeal**: [`TevmActionsApi`](TevmActionsApi.md)\[`"deal"`\]

### tevmDeploy

> **tevmDeploy**: [`TevmActionsApi`](TevmActionsApi.md)\[`"deploy"`\]

### tevmDumpState

> **tevmDumpState**: [`TevmActionsApi`](TevmActionsApi.md)\[`"dumpState"`\]

### tevmGetAccount

> **tevmGetAccount**: [`TevmActionsApi`](TevmActionsApi.md)\[`"getAccount"`\]

### tevmLoadState

> **tevmLoadState**: [`TevmActionsApi`](TevmActionsApi.md)\[`"loadState"`\]

### tevmMine

> **tevmMine**: [`TevmActionsApi`](TevmActionsApi.md)\[`"mine"`\]

### tevmReady

> **tevmReady**: [`TevmNode`](TevmNode.md)\[`"ready"`\]

### tevmSetAccount

> **tevmSetAccount**: [`TevmActionsApi`](TevmActionsApi.md)\[`"setAccount"`\]

### tevmSimulateCall

> **tevmSimulateCall**: [`TevmActionsApi`](TevmActionsApi.md)\[`"simulateCall"`\]

## Example

```typescript
import { createTevmClient, tevmViemActions } from 'tevm'

const client = createTevmClient()
  .extend(tevmViemActions())
```
